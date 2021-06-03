import * as connections from '../../config/connection/connection';
import { Document, Schema, Model } from 'mongoose';
import { IProject } from '../Project/model';

// /**
//  * @export
//  * @interface IRepository
//  * @extends { Document }
//  */
export interface IDomain extends Document {
    name: string,
    link: string,
    argoKey: string,
    isLatest: boolean,
    type: string,
    verified: boolean,
    projectId: IProject['_id']
}

const DomainSchema: Schema = new Schema(
    {
        name: String,
        link: String,
        argoKey: String,
        isLatest: Boolean,
        type: String,
        verified: { type: Boolean, default: false },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'ProjectModel',
        }
    },
    {
        collection: 'domains',
        timestamps: true,
        versionKey: false,
    }
);

export default connections.db.model<IDomain>('DomainModel', DomainSchema);