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
        //TODO update organization with wallet
        res.status(200).json(wallet);

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function approve(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const { walletId, amountToApprove }: { walletId: string, amountToApprove: number } = req.body;
        const approvedAmount = await WalletService.approve(walletId, amountToApprove);
        res.send(200).json(approvedAmount);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function discharge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
      try {
        const { walletId, amountToDischarge }: { walletId: string, amountToDischarge: number } = req.body;
        const approvedAmount = await WalletService.approve(walletId, amountToDischarge);
        res.send(200).json(approvedAmount);
      } catch (error) {
          next(new HttpError(error.message.status, error.message));
      }
  }
