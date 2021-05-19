import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import WalletService from './service';
import { IWalletModel } from './model';
import JWTTokenService from '../Session/service';
import UserService from '../User/service';
import { IUserModel } from '../User/model';
import { IOrganization } from '../Organization/model';
import OrganizationService from '../Organization/service';

export async function createWallet(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        const user: IUserModel = await UserService.findOne(deserializedToken.session_id);

        const { address, organizationId } : { address: string, organizationId: string } = req.body;

        const organization: IOrganization = await OrganizationService.findOne(organizationId);
        
        const isUserInOrganization: boolean = user.organizations.some((orgUser) => {
            return orgUser._id.equals(organizationId)
        });

        if (!isUserInOrganization) {
            console.log('user is not part of sent organization');
            res.status(400).json({
                success: false,
                message: "user is not part of sent organization",
            });
            return;
        }

        const wallet: IWalletModel = await WalletService.insert(address);
        await OrganizationService.updateWallet(organizationId, wallet._id.toString());
        organization.wallet = wallet._id;
        res.status(200).json(wallet);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
