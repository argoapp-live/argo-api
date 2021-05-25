import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import WalletService from './service';
import { IWalletModel } from './model';
import { IUserModel } from '../User/model';
import OrganizationService from '../Organization/service';
import AuthService from '../Auth/service';

export async function createWallet(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const user: IUserModel = await AuthService.authUser(req);

        if (!user) {
            // return error
        }

        const { address, orgId } : { address: string, orgId: string } = req.body;
        
        const isUserInOrganization: boolean = user.organizations.some((orgUser) => {
            return orgUser._id.equals(orgId)
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
        await OrganizationService.updateWallet(orgId, wallet._id.toString());
        res.status(200).json(wallet);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
