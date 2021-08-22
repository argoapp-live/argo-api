import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';

export interface ISubscriptionPackage extends Document {
    name: string,
    price: number,
    span: number,
    numberOfAllowedDeployments: number,
    numberOfAllowedWebHooks: number, 
    allowedBuildTime: number,
    custom: boolean
}

const SubscriptionPackageSchema: Schema = new Schema(
    {
        name: String,
        price: Number,
        span: Number,
        numberOfAllowedDeployments: Number,
        numberOfAllowedWebHooks : Number,
        allowedBuildTime: Number,
        custom: {
            type : Boolean,
            default : false             
        } 
    },
    {
        collection: 'subscriptionPackages',
        timestamps: true,
        versionKey: false,
    }
);

export default connections.db.model<ISubscriptionPackage>('SubscriptionPackageModel', SubscriptionPackageSchema);