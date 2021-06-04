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

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const users: IOrganization[] = await OrganizationService.findAll();

        res.status(200).json(users);
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

        console.time("Testong org")
        const wallet: IWalletModel = await WalletService.findOne({ organizationId: organization._id });
        organization._doc.wallet = wallet;
        console.timeEnd("Testong org")

        console.time("Testong org1")
        const projects = await ProjectService.find({ organizationId: organization._id })
        console.timeEnd("Testong org1")

        console.time("Testong org2")
        const promises = projects.map((project: any) => {
            return _populateProject(project);
        })
        organization._doc.projects = await Promise.all(promises);
        console.timeEnd("Testong org2")


        if(organization.wallet) {
        console.time("Testong org3")
            const payments: any = await axios.get(`${config.paymentApi.HOST_ADDRESS}/wallet/${organization.wallet._id}`);
        console.timeEnd("Testong org3")

        console.time("Testong org4")

            if (!payments.data) {
                organization._doc.payments = [];
            } else {
                const promises = payments.data.map((payment: any) => {
                    return _populatePayment(payment);
                })
                organization._doc.payments = await Promise.all(promises);
            }
        console.timeEnd("Testong org4")

            
        }

        console.timeEnd("Testong org")

        res.status(200).json(organization);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

async function _populatePayment(payment: any): Promise<any> {
    const deployment = await DeploymentService.findById(payment.deploymentId);
    payment.buildTime = deployment.buildTime;
    payment.projectName = deployment.project.name;
    return payment;
}

async function _populateProject(project: any): Promise<any> {
    const deployment = await DeploymentService.findLatestDeployed(project._id);
    project._doc.sitePreview = deployment ? deployment.sitePreview : undefined;
    const domains = await DomainService.find({ projectId: project._id });
    project._doc.domains = domains.filter(domain => domain.type === 'domain');
    project._doc.subdomains = domains.filter(domain => domain.type === 'subdomain');
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
