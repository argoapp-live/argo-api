import OrganizationService from './service';
import { HttpError } from '../../config/error';
import { IOrganization } from './model';
import { NextFunction, Request, Response } from 'express';
import JWTTokenService from '../Session/service';
import { IUserModel } from '../User/model';
import UserService from '../User/service';
import axios from 'axios';
import config from '../../config/env';
import DeploymentService from '../Deployment/service';
import ProjectService from '../Project/service';
import DomainService from '../Domain/service';
import WalletService from '../Wallet/service';
import { IWalletModel } from '../Wallet/model';
import { IProject } from '../Project/model';
import { Types } from 'mongoose';
import { IDomain } from '../Domain/model';
import { IDeployment } from '../Deployment/model';

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const organizations: IOrganization[] = await OrganizationService.find({});
        res.status(200).json(organizations);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let organization: any = await OrganizationService.findOne(req.params.id);
        if(!organization) {
            // TODO return null
        }

        const wallet: IWalletModel = await WalletService.findOne({ organizationId: organization._id });
        organization._doc.wallet = wallet;

        const projects: Array<IProject> = await ProjectService.find({ organizationId: organization._id });

        const projectIds: Array<Types.ObjectId> = projects.map((project: IProject) => {
            return project._id;
        });

        const domains: Array<IDomain> = await DomainService.find({ projectId: { "$in" : projectIds }});
        organization._doc.projects = projects.map((project: any) => {
            return _populateProject(project, domains);
        });

        if(wallet) {
            const payments: any = await axios.get(`${config.paymentApi.HOST_ADDRESS}/payments/wallet/${wallet._id}`);
            if (!payments.data) {
                organization._doc.payments = [];
            } else {
                const deploymentIds = payments.data.map((payment: any) => payment.deploymentId);
                const deployments: Array<IDeployment> = await DeploymentService.find({ _id: { "$in" : deploymentIds }});
                organization._doc.payments = payments.data.map((payment: any) => {
                    return _populatePayment(payment, deployments);
                })
            }
        }

        res.status(200).json(organization);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

function _populatePayment(payment: any, deployments: Array<IDeployment>): any {
    const deployment: any = deployments.filter((deployment) => deployment.paymentId?.toString() === payment._id?.toString())[0]
    payment.buildTime = deployment ? deployment.buildTime : 0;
    payment.projectName = deployment? deployment.project.name: '';
    return payment;
}

function _populateProject(project: any, domains: Array<IDomain>): any {
    const projectDomains: Array<IDomain> = domains.filter((domain: IDomain) => domain.projectId?.toString() === project._id?.toString());
    project._doc.domains = projectDomains.filter(domain => domain.type === 'domain');
    project._doc.subdomains = projectDomains.filter(domain => domain.type === 'subdomain');
    project._doc.handshakeDomains = projectDomains.filter(domain => domain.type === 'handshake-domain');
    project._doc.handshakeSubdomains = projectDomains.filter(domain => domain.type === 'handshake-subdomain');
    return project;
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const organization: IOrganization = await OrganizationService.insert(req.body);

        const jwtToken: any = await JWTTokenService.DecodeToken(req);
        const decodedToken: any = await JWTTokenService.VerifyToken(jwtToken);
        const userService: IUserModel = await UserService.updateUserOrganization(organization._id, decodedToken.session_id);


        const orgModel: IOrganization = await OrganizationService.findOneAndUpdate(organization.id, decodedToken.session_id);

        res.status(200).json({ id: orgModel._id, success: true });
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const organization: IOrganization = await OrganizationService.remove(req.params.id);

        res.status(200).json(organization);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const organization: IOrganization = await OrganizationService.updateOrganization(req.params.id, req.body);

        res.status(200).json(organization);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
