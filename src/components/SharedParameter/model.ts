import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';

export interface ISharedParameter extends Document {
    name: string,
    description: string,
    value: string
}

const SharedParameterSchema: Schema = new Schema(
    {
        name: {
            type: String,
            unique: true
        },
        description: String,
        value: String,
        
    },
    {
        collection: 'sharedParameter',
        timestamps: true,
        versionKey: false,
    }
);

export default connections.db.model<ISharedParameter>('SharedParameterModel', SharedParameterSchema);