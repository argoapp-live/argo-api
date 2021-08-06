import { IWalletModel } from "../Wallet/model";

export interface ISubscriptionPaymentRequest {
    wallet: IWalletModel,
    amount: number,
    subscriptionId: string,
}
