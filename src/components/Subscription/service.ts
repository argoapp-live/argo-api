import { ISubscriptionPackage } from "../SubscriptionPackage/model";
import SubscriptionPackageModel, { ISubscription } from "./model";


const SubscriptionService = {
    async insertActive(subscriptionPackage: ISubscriptionPackage, organizationId: string): Promise<ISubscription> {

        const currentDate = new Date();

        const dateOfIssue = currentDate.getTime();
        currentDate.setDate(currentDate.getDate() + subscriptionPackage.span);
        const dateOfExpiration = currentDate.getTime();

        const data: any = {
            dateOfIssue, 
            dateOfExpiration,
            state: 'DEMANDED',
            organizationId,
            subscriptionPackageId: subscriptionPackage.id
        }

        return SubscriptionPackageModel.create(data);
    },

    async insertPending(subscriptionPackage: ISubscriptionPackage, organizationId: string): Promise<ISubscription> {
        const data: any = {
            dateOfIssue: -1, 
            dateOfExpiration: -1,
            state: 'PENDING',
            organizationId,
            subscriptionPackageId: subscriptionPackage.id
        }

        return SubscriptionPackageModel.create(data);
    },

    async findById(id: string): Promise<ISubscription> {
        return SubscriptionPackageModel.findById(id);
    },

    async findOne(query: any): Promise<ISubscription> {
        return SubscriptionPackageModel.findOne(query);
    },

    async find(query: any): Promise<Array<ISubscription>> {
        return SubscriptionPackageModel.find(query);
    },

    async updateOne(id: string, query: any): Promise<Array<ISubscription>> {
        return SubscriptionPackageModel.updateOne(id, query);
    },
}

export default SubscriptionService;