import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import DeploymentService from '../Deployment/service';


export async function insertPayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        const { paymentId, deploymentId }: 
            { paymentId: string, deploymentId: string } = req.body;

        await DeploymentService.updatePayment(deploymentId, paymentId);
        console.log('PAYMENT PROCESSED IN ARGO-API')
        //TODO socket notify
        // create socket and emit new payment processed
        res.send(201).json({ msg: 'Payment successfully recorded'})
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
