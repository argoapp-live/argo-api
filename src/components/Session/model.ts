import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';

export interface IArgoSessionModel extends Document {
  session_id: string;
  access_token: string;
  is_active: boolean;
}

const ArgoSessionSchema: Schema = new Schema(
  {
    session_id: String,
    access_token: String,
    is_active: Boolean,
  },
  {
    collection: 'argosessions',
    versionKey: false,
  }
);

export default connections.db.model<IArgoSessionModel>(
  'ArgoSession',
  ArgoSessionSchema
);
