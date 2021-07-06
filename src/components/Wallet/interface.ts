/**
 * @export
 * @interface IWalletService
 */

 import { IWalletModel } from "./model";

 export default interface IWalletService {
    findById(id: string): Promise<IWalletModel>;
    findOne(query: Partial<IWalletModel>): Promise<IWalletModel>;
    insert(address: string, organizationId: string): Promise<IWalletModel>;
    remove(id: string): Promise<void>;
 }
 
 