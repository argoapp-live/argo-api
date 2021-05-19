import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import DeploymentService from '../Deployment/service';
import notificationService from '../Notification';


export async function insertPayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
    try {
        // const { paymentId, deploymentId, amount, topic }: 
        //     { paymentId: string, deploymentId: string, amount: number, topic: string } = req.body;

        // await DeploymentService.updatePayment(deploymentId, paymentId);
        // console.log('PAYMENT PROCESSED IN ARGO-API')
        // notificationService.emit(topic, { deploymentId, amount });
        // res.send(201).json({ msg: 'Payment successfully recorded'})
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
