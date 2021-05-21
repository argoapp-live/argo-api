import * as connections from '../../config/connection/connection';
import { Document, Schema, Model, Types } from 'mongoose';
import { IUserModel } from '../User/model';
import { IWalletModel } from '../Wallet/model';

/**
 * @export
 * @interface IRepository
 * @extends { Document }
 */
export interface IRepository extends Document {
    name: String;
    url: String;
    webHook: String;
    deployments: [IDeployment['_id']];
    updateDate: Date;
    createDate: Date;
    orgId: Types.ObjectId;
    package_manager: string;
    build_command: string;
    publish_dir: string;
    branch: string;
    sitePreview: string;
    framework: string;
    workspace: string,
    domains: [{
        _id?: Types.ObjectId
        name: string,
        transactionId: string,
        isLatestDomain: boolean,
        argoDomainKey: string,
        ownerVerified: boolean
    }],
    subDomains: [{
        _id?: Types.ObjectId
        name: string,
        transactionId: string,
        isLatestSubDomain: boolean,
        argoDomainKey: string,
        ownerVerified: boolean
    }]
}

/**
 * @export
 * @interface IDeployment
 * @extends {Document}
 */
export interface IDeployment extends Document {
    sitePreview: string;
    commitId: String;
    logs: [{ time: String, log: String }];
    createdAt: any;
    topic: string;
    branch: string;
    deploymentStatus: string;
    package_manager: string;
    build_command: string;
    publish_dir: string;
    github_url: string;
    framework: string;
    workspace: string,
    paymentId: string,
    repository: [IRepository['_id']],
}

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
    repositories: [IRepository['_id']];
    users: [IUserModel['_id']];
    wallet: [IWalletModel['_id']],
}

const RepositorySchema: Schema = new Schema({
    name: String,
    url: String,
    webHook: String,
    deployments: [{
        type: [Schema.Types.ObjectId],
        ref: 'Deployment',
    }],
    createDate: {
        type: Date, default: new Date()
    },
    updateDate: {
        type: Date, default: new Date()
    },
    orgId: Types.ObjectId,
    package_manager: String,
    build_command: String,
    publish_dir: String,
    branch: String,
    sitePreview: String,
    framework: String,
    workspace: String,
    domains: [{
        name: String,
        transactionId: String,
        isLatestDomain: Boolean,
        argoDomainKey: String,
        ownerVerified: Boolean
    }],
    subDomains: [{
        name: String,
        transactionId: String,
        isLatestSubDomain: Boolean,
        argoDomainKey: String,
        ownerVerified: Boolean
    }]
});

const DeploymentSchema: Schema = new Schema({
    sitePreview: String,
    commitId: String,
    logs: [{ time: String, log: String }],
    topic: String,
    createdAt: { type: String, default: new Date() },
    branch: String,
    deploymentStatus: { type: String, default: 'Pending' },
    package_manager: String,
    build_command: String,
    publish_dir: String,
    github_url: String,
    framework: String,
    workspace: String,
    paymentId: String,
    repository: {
        type: [Schema.Types.ObjectId],
        ref: 'RepositoryModel',
    },
});

const OrganizationSchema: Schema = new Schema(
    {
        profile: {
            name: { type: String, default: 'default', required: true },
            image: { type: String, required: false },
            username: String,
        },
        repositories: [{
            type: Schema.Types.ObjectId,
            ref: 'Repository'
        }],
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'UserModel',
            },
        ],
        wallet: {
            type: [Schema.Types.ObjectId],
            ref: 'WalletModel',
        },
    },
    {
        collection: 'organizationsdb',
        versionKey: false,
    }
);

export const DeploymentModel: Model<IDeployment> = connections.db.model<IDeployment>('Deployment', DeploymentSchema);

export const RepositoryModel: Model<IRepository> = connections.db.model<IRepository>('Repository', RepositorySchema);

export const OrganizationModel: Model<IOrganization> = connections.db.model<IOrganization>('Organization', OrganizationSchema);
