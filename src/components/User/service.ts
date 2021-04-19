import * as Joi from 'joi';
import UserModel, { IArgoUser, IArgoWallet, IUserModel } from './model';
import UserValidation from './validation';
import { IUserService } from './interface';
import { Types } from 'mongoose';
import { readContract, selectWeightedPstHolder } from 'smartweave';
import Arweave = require('arweave');
import config from '../../config/env';

/**
 * @export
 * @implements {IUserModelService}
 */
const UserService: IUserService = {
    /**
     * @returns {Promise < IUserModel[] >}
     * @memberof UserService
     */
    async findAll(): Promise<IUserModel[]> {
        try {
            return await UserModel.find({});
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async findOne(id: string): Promise<IUserModel> {
        try {
            return await UserModel.findOne({
                _id: Types.ObjectId(id)
            }).populate('organizations');
        } catch (error) {
            throw new Error(error.message);
        }
    },
    /**
    * @param {string} id
    * @returns {Promise < IUserModel >}
    * @memberof UserService
    */
    async findOneAndUpdate(id: string, user: IArgoUser): Promise<any> {
        try {

            const filter = {
                _id: Types.ObjectId(id)
            };

            const update = {
                argo_profile: user
            };

            await UserModel.findOneAndUpdate(filter, update);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async findOneByGithubId(id: string): Promise<IUserModel> {
        try {
            return await UserModel.findOne({
                profile: { id: Types.ObjectId(id) }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {IUserModel} user
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async insert(body: IUserModel): Promise<IUserModel> {
        try {
            const validate: Joi.ValidationResult<IUserModel> = UserValidation.createUser(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const user: IUserModel = await UserModel.create(body);

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async remove(id: string): Promise<IUserModel> {
        try {
            const filter = {
                'profile.id': id
            };
            const user: IUserModel = await UserModel.findOneAndRemove(filter);

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
    * @param {string} id
    * @returns {Promise < IUserModel >}
    * @memberof UserService
    */
    async updateOrganization(orgId: string, userId: string): Promise<IUserModel> {
        try {
            console.log('user organization');
            const filter = {
                'profile.id': userId
            };
            const update = {
                $addToSet: { organization: [orgId] }
            };
            const user: IUserModel = await UserModel.updateOne(filter, update);

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
    * @param {string} id
    * @returns {Promise < IUserModel >}
    * @memberof UserService
    */
    async updateUserOrganization(orgId: string, userId: string): Promise<IUserModel> {
        try {

            console.log('user organization', userId, orgId);
            const filter = {
                _id: Types.ObjectId(userId)
            };
            const update = {
                $addToSet: { organizations: [orgId] }
            };
            const user: IUserModel = await UserModel.updateOne(filter, update);

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
    async updateWalletBalance(id: string, wallet: IArgoWallet): Promise<any> {
        try {

            const filter = {
                _id: Types.ObjectId(id)
            };
            let updatedBalance: number = 0;
            const user = await UserModel.findById(filter);
            let prevBal = (user.argo_wallet.wallet_balance ? user.argo_wallet.wallet_balance : 0);
            updatedBalance = prevBal + wallet.wallet_balance;
            const update = {
                $set: {
                    'argo_wallet.wallet_balance': updatedBalance,
                    'argo_wallet.wallet_address': wallet.wallet_address
                }
            };
            await UserModel.findOneAndUpdate(filter, update);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    /**
   * @param {string} id
   * @returns {Promise < IUserModel >}
   * @memberof UserService
   */
    async reduceWalletBalance(id: string, deduction: number): Promise<any> {
        try {

            const filter = {
                _id: Types.ObjectId(id)
            };
            const user = await UserModel.findById(filter);

            if (user.argo_wallet.wallet_balance == 0) {
                return false;
            }
            const updatedBalance: number = user.argo_wallet.wallet_balance - deduction;
            const update = {
                $set: {
                    'argo_wallet.wallet_balance': updatedBalance,
                }
            };
            await UserModel.findOneAndUpdate(filter, update);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
  * @param {string} id
  * @returns {Promise < IUserModel >}
  * @memberof UserService
  */
    async updateWalletAddress(id: string, wallet: IArgoWallet): Promise<any> {
        try {

            const filter = {
                _id: Types.ObjectId(id)
            };
            const update = {
                $set: {
                    'argo_wallet.wallet_address': wallet.wallet_address
                }
            };
            await UserModel.findOneAndUpdate(filter, update);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
    * @param {string} id
    * @returns {Promise < IUserModel >}
    * @memberof UserService
    */
    async findOneAndUpdateDepTime(id: string, deploymentTime: number, gasPrice: number, status: string): Promise<boolean> {
        try {
            const filter = {
                _id: Types.ObjectId(id)
            };
            const user = await UserModel.findOne(filter);
            if (user) {
                let updatedDeploymentTime: Number = 0;
                if (user.totalDepTime) {
                    updatedDeploymentTime = user.totalDepTime + deploymentTime;
                }
                else {
                    updatedDeploymentTime = 0 + deploymentTime;
                }
                const totalPrice: number = (0.00015 * (+deploymentTime)) + (+gasPrice);
                const updatedBalance: number = user.argo_wallet.wallet_balance - totalPrice;
                const update = {
                    $set: {
                        totalDepTime: updatedDeploymentTime,
                        'argo_wallet.wallet_balance': updatedBalance
                    }
                };
                await UserModel.findOneAndUpdate(filter, update);
                // const arweave: Arweave = Arweave.init({
                //     host: config.arweave.HOST,
                //     port: config.arweave.PORT,
                //     protocol: config.arweave.PROTOCOL,
                // });
                // let paywallet: string = config.privateKey.AR_PRIVATE_KEY;
                // const contractState: any = await readContract(arweave, config.arweave.CONTRACT_ID);
                // const holder: any = selectWeightedPstHolder(contractState.balances);
                // const transaction: any = await arweave.createTransaction(
                //     {
                //         target: holder,
                //         quantity: arweave.ar.arToWinston(`${(0.00015 * (+deploymentTime))}`),
                //     },
                //     JSON.parse(paywallet)
                // );
                // transaction.addTag('App-Name', config.arweave.APP_NAME);

                // await arweave.transactions.sign(transaction, JSON.parse(paywallet));
                // await arweave.transactions.post(transaction);
                // console.log('pst transaction done', transaction.id);
                return true;
            }

            return false;

        } catch (error) {
            return true
        }
    }
};

export default UserService;
