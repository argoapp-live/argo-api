import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import WalletService from './service';
import { IWalletModel } from './model';
import { IUserModel } from '../User/model';
import AuthService from '../Auth/service';
import axios from 'axios';
import config from '../../config/env';

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

        const wallet: IWalletModel = await WalletService.insert(address, orgId);
        res.status(200).json(wallet);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function removeWallet(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const user: IUserModel = await AuthService.authUser(req);

        if (!user) {
            // return error
        }

        const { id, signature } : { id: string, signature: string } = req.body;

        const wallet: IWalletModel = await WalletService.findById(id);
        //TODO Check the signature
        const verifyBody = {
            address: wallet.address,
            signature
        }
        const verified = await axios.post(`${config.paymentApi.HOST_ADDRESS}/payments/wallet/verify-owner`, verifyBody);
        if(verified.data) {   
            await WalletService.remove(id);
            res.status(200).json({success: true});
        } else {
            res.status(200).json({success: false});
        }

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
