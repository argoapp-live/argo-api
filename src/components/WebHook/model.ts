import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';
import { IProject } from '../Project/model';
import { IConfiguration } from '../Configuration/model';
import { IOrganization } from '../Organization/model';


export interface IWebHook extends Document {
    name: string;
    branch: string;
    installationId: number,
    organizationId: IOrganization['_id'],
    projectId: IProject['_id'];
    configurationId: IConfiguration['_id'];
}

const WebHookSchema: Schema = new Schema(
    {
        name: String,
        installationId: Number,
        branch: String,
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'OrganizationModel',
        },
        configurationId: {
            type: Schema.Types.ObjectId,
            ref: 'ConfigurationModel',
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'ProjectModel',
        }
    },
    {
        collection: 'webhooks',
        timestamps: true,
        versionKey: false,
    }
);

export default connections.db.model<IWebHook>('WebHookModel', WebHookSchema);