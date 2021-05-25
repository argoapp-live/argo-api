import OrganizationService from './service';
import { HttpError } from '../../config/error';
import { IOrganization } from './model';
import { NextFunction, Request, Response } from 'express';
import JWTTokenService from '../Session/service';
import { IUserModel } from '../User/model';
import UserService from '../User/service';
import axios from 'axios';
import config from '../../config/env';

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
        const organization: any = await OrganizationService.findOne(req.params.id);

        if(organization.wallet) {
            const payments: any = await axios.get(`${config.paymentApi.HOST_ADDRESS}/wallet/${organization.wallet._id}`);
            organization.payments = payments;
        }

        res.status(200).json(organization);
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
