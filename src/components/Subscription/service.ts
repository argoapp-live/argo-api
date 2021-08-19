import { ISubscriptionPackage } from "../SubscriptionPackage/model";
import SubscriptionPackageModel, { ISubscription } from "./model";


const SubscriptionService = {
    async insertDemanded(subscriptionPackage: ISubscriptionPackage, organizationId: string, renew: boolean): Promise<ISubscription> {

        const currentDate = new Date();

        const dateOfIssue = currentDate.getTime();
        currentDate.setDate(currentDate.getDate() + subscriptionPackage.span);
        const dateOfExpiration = currentDate.getTime();

        const data: any = {
            dateOfIssue, 
            dateOfExpiration,
            state: 'DEMANDED',
            renew,
            organizationId,
            subscriptionPackageId: subscriptionPackage.id
        }

        return SubscriptionPackageModel.create(data);
    },

    async insertPending(subscriptionPackage: ISubscriptionPackage, organizationId: string, renew: boolean): Promise<ISubscription> {
        const data: any = {
            dateOfIssue: -1, 
            dateOfExpiration: -1,
            state: 'PENDING',
            renew,
            organizationId,
            subscriptionPackageId: subscriptionPackage.id
        }

        return SubscriptionPackageModel.create(data);
    },

    async findById(id: string): Promise<ISubscription> {
        return SubscriptionPackageModel.findById(id);
    },

    async findOne(query: any): Promise<ISubscription> {
        return await SubscriptionPackageModel.findOne(query).populate('subscriptionPackageId');
    },

    async find(query: any): Promise<Array<ISubscription>> {
        return SubscriptionPackageModel.find(query);
    },

    async updateOne(query: any, conditions: any): Promise<Array<ISubscription>> {
        return SubscriptionPackageModel.updateOne(query, conditions);
    },
}

export default SubscriptionService;