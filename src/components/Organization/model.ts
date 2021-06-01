import * as connections from '../../config/connection/connection';
import { Document, Schema, Model, Types } from 'mongoose';
import { IUserModel } from '../User/model';
import { IWalletModel } from '../Wallet/model';


/**
 * @export
 * @interface IOrganization
 * @extends {Document}
 */
export interface IOrganization extends Document {
    profile: {
        name: String;
        image: String;
        username: String;
    };
    users: [IUserModel['_id']];
    wallet: IWalletModel['_id'],
}

const OrganizationSchema: Schema = new Schema(
    {
        profile: {
            name: { type: String, default: 'default', required: true },
            image: { type: String, required: false },
            username: String,
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'UserModel',
            },
        ],
        wallet: {
            type: Schema.Types.ObjectId,
            ref: 'WalletModel',
        },
    },
    {
        collection: 'organizationsdb',
        versionKey: false,
    }
);

export const OrganizationModel: Model<IOrganization> = connections.db.model<IOrganization>('Organization', OrganizationSchema);
// export const RepositoryModel: Model<IRepository> = connections.db.model<IRepository>('Repository', RepositorySchema);

