import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import WalletService from './service';
import { IWalletModel } from './model';

export async function createWallet(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const wallet: IWalletModel = await WalletService.insert(req.body);
        //TODO connect with organisation
        res.status(200).json(wallet);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
