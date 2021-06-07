import * as connections from '../../config/connection/connection';
import { Document, Schema, Model } from 'mongoose';
import { IOrganization } from '../Organization/model';
import { IDeployment } from '../Deployment/model';

// /**
//  * @export
//  * @interface IRepository
//  * @extends { Document }
//  */
export interface IProject extends Document {
    name: string, 
    githubUrl: string,
    organizationId: IOrganization['_id']
    latestDeployment: IDeployment['_id']
}

const ProjectSchema: Schema = new Schema(
    {
        name: String,
        githubUrl: String,
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'OrganizationModel',
        },
        latestDeployment: {
            type: Schema.Types.ObjectId,
            ref: 'DeploymentModel',
        },
    },
    {
        collection: 'projects',
        timestamps: true,
        versionKey: false,
    }
);


export const ProjectModel: Model<IProject> = connections.db.model<IProject>('ProjectModel', ProjectSchema);
