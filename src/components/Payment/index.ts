import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import WalletService from '../Wallet/service';
import DeploymentService from '../Deployment/service';
import OrganizationService from '../Organization/service';


export async function insertPayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const { paymentId, ammountToDischarge, wallet, deploymentId, organisationId }: 
            { paymentId: string, ammountToDischarge: number, wallet: string, deploymentId: string, organisationId: string } = req.body;

        await DeploymentService.updatePayment(deploymentId, paymentId);
        await OrganizationService.updatePayment(organisationId, paymentId);
        const approvedValue: number = await WalletService.discharge(wallet, ammountToDischarge);
        //TODO socket notify


    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
