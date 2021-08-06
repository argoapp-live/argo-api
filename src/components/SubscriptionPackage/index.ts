import { ISubscriptionPackage } from "./model";
import SubscriptionPackageService from "./service";

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

export async function insert(data: any): Promise<ISubscriptionPackage> {
    try {
        return SubscriptionPackageService.insert(data);
    } catch(error) {
        throw new Error(error.message);
    }
}