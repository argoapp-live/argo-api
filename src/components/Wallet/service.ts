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
    async insert(address: string): Promise<IWalletModel> {
        try {
            //TODO validate body
            return WalletModel.create({ address });
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default WalletService;

 