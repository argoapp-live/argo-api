import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';

// /**
//  * @export
//  * @interface IRepository
//  * @extends { Document }
//  */
export interface IConfiguration extends Document {
    branch: string,
    buildCommand: string, 
    workspace: string,
    publishDir: string,
    packageManager: string,
    framework: string,
}

const ConfigurationSchema: Schema = new Schema(
    {
        branch: String,
        buildCommand: String, 
        workspace: String,
        publishDir: String,
        packageManager: String,
        framework: String,
    },
    {
        collection: 'configurations',
        versionKey: false,
    }
);

export default connections.db.model<IConfiguration>('ConfigurationModel', ConfigurationSchema);