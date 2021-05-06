/**
 * @export
 * @interface IWalletService
 */

 import { IWalletModel } from "./model";

 export default interface IWalletService {
    findOne(id: string): Promise<IWalletModel>;
    insert(orgDto: IWalletModel): Promise<IWalletModel>;
    approve(walletId: string, amountToApprove: number): Promise<any>;
    discharge(walletId: string, amountToDischarge: number): Promise<any>;
 }
 
 