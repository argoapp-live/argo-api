import WalletModel, { IWalletModel } from './model';
import IWalletService from './interface';

/**
 * @export
 * @implements {IWalletService}
 */
const WalletService: IWalletService = {
  async findById(id: string): Promise<IWalletModel> {
    try {
      return WalletModel.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async findOne(query: Partial<IWalletModel>): Promise<IWalletModel> {
    try {
      return WalletModel.findOne(query);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async insert(address: string, organizationId: string): Promise<IWalletModel> {
    try {
      // TODO validate body
      return WalletModel.create({ address, organizationId });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async remove(id: string): Promise<void> {
    try {
      // TODO validate body
      return WalletModel.remove({ _id: id });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default WalletService;
