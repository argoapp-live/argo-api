
import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';

export interface IArgoSessionModel extends Document {
    sessionId: string;
    accessToken: string;
    isActive: boolean;
}

const ArgoSessionSchema: Schema = new Schema({
    sessionId: String,
    accessToken: String,
    isActive: Boolean,
}, {
    collection: 'argosessions',
    versionKey: false
});

export default connections.db.model<IArgoSessionModel>('ArgoSession', ArgoSessionSchema);
