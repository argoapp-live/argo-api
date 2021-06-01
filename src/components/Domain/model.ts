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
    url: string, 
    transaction: string,
    txtUid: string,
    isLatest: boolean,
    type: string,
    projectId: IProject['_id']
}

const DomainSchema: Schema = new Schema(
    {
        name: String,
        url: String, 
        transaction: String,
        txtUid: String,
        isLatest: String,
        type: String,
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'ProjectModel',
        }
    },
    {
        collection: 'organization',
        versionKey: false,
    }
);

export default connections.db.model<IDomain>('DomainModel', DomainSchema);