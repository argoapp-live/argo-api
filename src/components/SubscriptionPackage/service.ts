import SubscriptionPackageModel, { ISubscriptionPackage } from "./model";


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
}

export default SubscriptionPackageService;