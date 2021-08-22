import SubscriptionPackageModel, { ISubscriptionPackage } from "./model";
import SharedParameterService from "../SharedParameter/service";
import { ISharedParameter } from "../SharedParameter/model";


const SubscriptionPackageService = {
    async insert(data: any): Promise<ISubscriptionPackage> {
        return SubscriptionPackageModel.create(data);
    },

    async findById(id: string): Promise<ISubscriptionPackage> {
        return SubscriptionPackageModel.findById(id);
    },

    async findOne(query: any): Promise<ISubscriptionPackage> {
        return SubscriptionPackageModel.findOne(query);
    },

    async find(query: any): Promise<Array<ISubscriptionPackage>> {
        return SubscriptionPackageModel.find(query);
    },
    async calculatePrice(numberOfAllowedDeployments:number, numberOfAllowedWebHooks:number, allowedBuildTime:number) : Promise<Number>{
        const pricePerDeploymentParameter: ISharedParameter = await SharedParameterService.findOne({name : "PRICE_PER_DEPLOYMENT"});
        const pricePerWebhookParameter: ISharedParameter = await SharedParameterService.findOne({name : "PRICE_PER_WEBHOOK"});
        const priceBuildingTimeParameter: ISharedParameter = await SharedParameterService.findOne({name : "PRICE_BUILDING_TIME"});
        const pPerDeploy:number = Number(pricePerDeploymentParameter.value);
        const pPerWebhook:number = Number(pricePerWebhookParameter.value);
        const pBuildTime:number = Number(priceBuildingTimeParameter.value);
        return pPerDeploy*numberOfAllowedDeployments + pPerWebhook* numberOfAllowedWebHooks + pBuildTime*allowedBuildTime;
    }

}

export default SubscriptionPackageService;