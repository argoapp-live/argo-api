import { IWalletModel } from "../Wallet/model";

export interface ISubscriptionPaymentRequest {
    wallet: IWalletModel,
    amount: number,
    subscriptionId: string,
}

export interface IConstraintCheckResponse {
    canDeploy: boolean,
    msg: string,
}
