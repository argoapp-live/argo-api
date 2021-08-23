import { ISubscriptionPackage } from "./model";
import SubscriptionPackageService from "./service";
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../config/error';

export async function find(query: any): Promise<Array<ISubscriptionPackage>> {
    try {
        return SubscriptionPackageService.find(query);
    } catch(error) {
        throw new Error(error.message);
    }
}

export async function findById(id: string): Promise<ISubscriptionPackage> {
    try {
        return SubscriptionPackageService.findById(id);
    } catch(error) {
        throw new Error(error.message);
    }
}

export async function insert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {numberOfAllowedDeployments, numberOfAllowedWebHooks, allowedBuildTime, price} :
         {numberOfAllowedDeployments: number, numberOfAllowedWebHooks: number,allowedBuildTime: number, price: number } = req.body;
        // check if there is already a subscription package with same parameters 
        const samePackage: ISubscriptionPackage = await SubscriptionPackageService.findOne({numberOfAllowedDeployments,numberOfAllowedWebHooks,allowedBuildTime}); 
        if(samePackage){
            res.status(200).json(
                { message : `Package with same parameters already exists. Name of package :  ${samePackage.name}` }
            )
            return;
        }     
        const calculatedPrice:Number = await SubscriptionPackageService.calculatePrice(numberOfAllowedDeployments, numberOfAllowedWebHooks, allowedBuildTime);
        if(calculatedPrice != price){
            res.status(200).json(
                { message : `Price doesn't match. Try again.` }
            )
            return;
        }
        const subPackage = await SubscriptionPackageService.insert(req.body);
        res.status(200).json(subPackage);
    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}
export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const subscriptionPackages: ISubscriptionPackage[] = await SubscriptionPackageService.find({});
        res.status(200).json(subscriptionPackages);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
export async function findDefaultPackages(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try {
        const subscriptionPackages: ISubscriptionPackage[] = await SubscriptionPackageService.find({custom : false});
        res.status(200).json(subscriptionPackages);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}
export async function calculatePrice(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try {
        const {numberOfAllowedDeployments, numberOfAllowedWebHooks, allowedBuildTime} :
         {numberOfAllowedDeployments: number, numberOfAllowedWebHooks: number,allowedBuildTime: number } = req.body;
        const price:Number = await SubscriptionPackageService.calculatePrice(numberOfAllowedDeployments, numberOfAllowedWebHooks, allowedBuildTime);
        res.status(200).json(price);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}



