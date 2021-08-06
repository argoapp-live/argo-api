import { NextFunction, Request, Response } from "express";
import { ISubscription} from "./model";
import SubscriptionService from "./service";
import { IOrganization } from '../Organization/model';
import OrganizationService from '../Organization/service';
import { ISubscriptionPackage } from "../SubscriptionPackage/model";
import SubscriptionPackageService from "../SubscriptionPackage/service";
import HttpError from "../../config/error";
import axios from "axios";
import config from '../../config/env/index';
import { IWalletModel } from "../Wallet/model";
import WalletService from "../Wallet/service";
import { ISubscriptionPaymentRequest } from "./interfaces";

export async function subscribe(req: Request, res: Response, next: NextFunction) {
    try {
        //TODO authorize
        const { subscriptionPackageId, organizationId, renew }: { subscriptionPackageId: string, organizationId: string, renew: boolean} = req.body;
    
        const organization: IOrganization = await OrganizationService.findById(organizationId);
        if (!organization) throw new Error('no organization');
    
        const subscriptionPackage: ISubscriptionPackage = await SubscriptionPackageService.findById(subscriptionPackageId);
        if (!organization) throw new Error('no subscription package');
    
        const subscription: ISubscription = await SubscriptionService.findOne({ state: { $in: ['ACTIVE', 'PENDING', 'DEMANDED'] }, organizationId });
        if (subscription) throw new Error('active, pending or demanded subscription already exists');
    
        const newSubscription: ISubscription = await SubscriptionService.insertDemanded(subscriptionPackage, organizationId, renew);

        if(renew) {
            await SubscriptionService.insertPending(subscriptionPackage, organizationId, renew);
        }
    
        res.status(200).json(newSubscription);

        const wallet: IWalletModel = await WalletService.findOne({ organizationId });

        const subscriptionPaymentRequest: ISubscriptionPaymentRequest = {
            wallet,
            amount: subscriptionPackage.price,
            subscriptionId: newSubscription.id
        }

        const subscriptionResponse: any = await axios.post(`${config.paymentApi.HOST_ADDRESS}/payments/subscibe`, subscriptionPaymentRequest);

        if (subscriptionResponse.status !== 200) {
            await SubscriptionService.updateOne(newSubscription.id, { state: 'ERROR' });
        }

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}


export async function changeSubscriptionPackage(req: Request, res: Response, next: NextFunction) {
    try {
        //TODO authorize
        const { subscriptionPackageId, organizationId }: { subscriptionPackageId: string, organizationId: string } = req.body;
    
        const organization: IOrganization = await OrganizationService.findById(organizationId);
        if (!organization) throw new Error('no organization');
    
        const subscriptionPackage: ISubscriptionPackage = await SubscriptionPackageService.findById(subscriptionPackageId);
        if (!organization) throw new Error('no subscription package');
    
        const activeSubscription: ISubscription = await SubscriptionService.findOne({ state: 'ACTIVE', organizationId });
        if (!activeSubscription) throw new Error('no active subscription');
        
        const pendingSubscription: ISubscription = await SubscriptionService.findOne({ state: 'PENDING', organizationId });
        if (pendingSubscription) {
            await SubscriptionService.updateOne(pendingSubscription.id, { subscriptionPackageId });
            res.status(200).json(pendingSubscription);
            return;
        }

        const newPendingSubscription: ISubscription = await SubscriptionService.insertPending(subscriptionPackage, organizationId, activeSubscription.renew);
        res.status(200).json(newPendingSubscription);

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function activateOrRejectSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { subscriptionId, state }: { subscriptionId: string, state: string } = req.body;
    
        const subscription: ISubscription = await SubscriptionService.findById(subscriptionId);
        if (!subscription) throw new Error('no subscription to update from payment');
        
        await SubscriptionService.updateOne(subscriptionId, { state });

        if(state=== 'REJECTED') {
            const prendingSubscription: ISubscription = await SubscriptionService.findOne({ organizationId: subscription.organizationId, state: 'PENDING' });
            await SubscriptionService.updateOne(prendingSubscription.id, { state: 'CANCELED' });
        }

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}


export async function cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { organizationId }: { organizationId: string } = req.body;

        const organization: IOrganization = await OrganizationService.findById(organizationId);
        if (!organization) throw new Error('no organization');

        const subscription: ISubscription = await SubscriptionService.findOne({ organizationId, state: 'PENDING' });
        if (!subscription) throw new Error('no subscription to update from payment');
        
        await SubscriptionService.updateOne(subscription.id, { state: 'CANCELED' });

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}



export async function find(query: any): Promise<Array<ISubscription>> {
    try {
        return SubscriptionService.find(query);
    } catch(error) {
        throw new Error(error.message);
    }
}

export async function findById(id: string): Promise<ISubscription> {
    try {
        return SubscriptionService.findById(id);
    } catch(error) {
        throw new Error(error.message);
    }
}