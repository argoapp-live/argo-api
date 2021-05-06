import  WalletModel, { IWalletModel } from './model';
import IWalletService from './interface';
import { Types } from 'mongoose';

/**
 * @export
 * @implements {IWalletService}
 */
const WalletService: IWalletService = {
    async findOne(id: string): Promise<IWalletModel> {
        try {
            return WalletModel.findOne({ _id: Types.ObjectId(id) });
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async insert(body: any): Promise<IWalletModel> {
        try {
            //TODO validate body
            return WalletModel.create(body);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async approve(walletId: string, amountToApprove: number): Promise<any> {
        try {
            const filter: any = {
                _id: Types.ObjectId(walletId),
            };

            const update: any = {
                $inc: { approved: amountToApprove }
            }

            const updatedWallet = await WalletModel.findOneAndUpdate(filter, update);
            return updatedWallet.approved;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async discharge(walletId: string, amountToDischarge: number): Promise<any> {
        try {
            const filter: any = {
                _id: Types.ObjectId(walletId),
            };

            const update: any = {
                $inc: { approved: -amountToDischarge }
            }

            const updatedWallet = await WalletModel.findOneAndUpdate(filter, update);
            return updatedWallet.approved;
            
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default WalletService;

 