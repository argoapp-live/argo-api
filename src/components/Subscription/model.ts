import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';
import { IOrganization } from '../Organization/model';
import { ISubscriptionPackage } from '../SubscriptionPackage/model';

export interface ISubscription extends Document {
    dateOfIssue: number,
    dateOfExpiration: number,
    state: string, 
    renew: boolean,
    organizationId: IOrganization['_id'],
    subscriptionPackageId: ISubscriptionPackage['_id']
}

const SubscriptionSchema: Schema = new Schema(
    {
        dateOfIssue: Number,
        dateOfExpiration: Number,
        renew: Boolean,
        state: {
            type: String,
            enum: ['ACTIVE', 'EXPIRED', 'PENDING', 'DEMANDED', 'ERROR', 'REJECTED', 'CANCELED'],
        }, 
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization'
        },
        subscriptionPackageId: {
            type: Schema.Types.ObjectId,
            ref: 'SubscriptionPackageModel'
        },
    },
    {
        collection: 'subscriptions',
        timestamps: true,
        versionKey: false,
    }
);

export default connections.db.model<ISubscription>('SubscriptionModel', SubscriptionSchema);