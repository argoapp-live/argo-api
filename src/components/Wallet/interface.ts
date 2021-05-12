/**
 * @export
 * @interface IWalletService
 */

 import { IWalletModel } from "./model";

 export default interface IWalletService {
    findOne(id: string): Promise<IWalletModel>;
    insert(address: string): Promise<IWalletModel>;
 }
 
 