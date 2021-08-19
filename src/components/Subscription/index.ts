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
import { IConstraintCheckResponse, ISubscriptionPaymentRequest } from "./interfaces";
import { DeploymentComponent, ProjectComponent } from "..";
import { IConfiguration } from "../Configuration/model";
import ConfigurationService from "../Configuration/service";
import { IProject } from "../Project/model";
import ProjectService from "../Project/service";
import DeploymentService from "../Deployment/service";
import { DeploymentModel } from "../Deployment/model";

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

        const subscriptionResponse: any = await axios.post(`${config.paymentApi.HOST_ADDRESS}/payments/subscribe`, subscriptionPaymentRequest);

        if (subscriptionResponse.status !== 200) {
            await SubscriptionService.updateOne(newSubscription.id, { state: 'ERROR' });
        }

    } catch(error) {
        next(new HttpError(404, error.message));
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
        next(new HttpError(404, error.message));
    }
}

export async function activateOrRejectSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { subscriptionId, state }: { subscriptionId: string, state: string } = req.body;
    
        const subscription: ISubscription = await SubscriptionService.findById(subscriptionId);
        if (!subscription) throw new Error('no subscription to update from payment');
        
        await SubscriptionService.updateOne({ _id: subscriptionId }, { state });

        if(state=== 'REJECTED') {
            const pendingSubscription: ISubscription = await SubscriptionService.findOne({ organizationId: subscription.organizationId, state: 'PENDING' });
            if(pendingSubscription){
                await SubscriptionService.updateOne(pendingSubscription.id, { state: 'CANCELED' });
            }
        }

        res.status(200).json({ msg: 'OK' });

    } catch(error) {
        next(new HttpError(404, error.message));
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

export async function getAcitveIfExists(req: Request, res: Response, next: NextFunction) {
    const { organizationId } = req.body;
    const activeSubscription :ISubscription = await SubscriptionService.findOne({organizationId, status : 'ACTIVE'});

    if(activeSubscription) {
        res.status(200).json({
            activeSubscription,
            exists: true,
        })
        return;
    }

    res.status(200).json({
        activeSubscription: null,
        exists: false,
    })
}

async function checkDeploymentConstraints(subscription: ISubscription, organizationId: string): Promise<IConstraintCheckResponse> {
    const projects: Array<IProject> = await ProjectService.find({ organizationId });

    const projectIds = projects.map((project: IProject) => {
        return project.id;
    })

    const deployments = await DeploymentService.allDeploymentsInSubscription(subscription.dateOfIssue, projectIds);

    console.log(deployments);
    //TODO add webhook logic later

    let canDeploy: boolean;
    let msg: string;

    const subscriptionPackage: ISubscriptionPackage = subscription.subscriptionPackageId;
    if(deployments.length < subscriptionPackage.numberOfAllowedDeployments) {
        canDeploy = true;
        msg = '';
    } else { 
        canDeploy = false;
        msg = 'number of allowed deployments exceeded'
    }

    return {
        canDeploy,
        msg
    }
}

export async function deploy(req: Request, res: Response, next: NextFunction) {
    const {
        organizationId,
        githubUrl,
        folderName,
        installationId,
        uniqueTopicId,
        configurationId,
        env,
        createDefaultWebhook,          
    } = req.body;

    const activeSubscription :ISubscription = await SubscriptionService.findOne({organizationId, state : 'ACTIVE'});
    if (!activeSubscription) throw new Error('No active sub');

    const constraintCheckResponse: IConstraintCheckResponse = await checkDeploymentConstraints(activeSubscription, organizationId);

    if(!constraintCheckResponse.canDeploy) {
        res.status(200).json({
            msg: constraintCheckResponse.msg, 
            success: false,
        });

        return;
    }
    

    const configuration: IConfiguration = await ConfigurationService.findById(configurationId);
    if (!configurationId) {
        throw new Error('No configuration');
    }

    const project = await ProjectComponent.createIfNotExists(githubUrl, organizationId, folderName, env, createDefaultWebhook, configuration.id, installationId);
    const wallet: IWalletModel = await WalletService.findOne({ organizationId });


    const responseObj: any = await DeploymentComponent.deployWithSubscription(githubUrl, installationId, uniqueTopicId, project, wallet, project.env, organizationId, 
        activeSubscription, configuration);

    res.status(200).json(responseObj);
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