import * as connections from '../../config/connection/connection';
import { Document, Schema, Model } from 'mongoose';
import { IOrganization } from '../Organization/model';

/**
 * @export
 * @interface IUserInvite
 * @extends { Document }
 */
export interface IUserInvite extends Document {
  userEmail: String;
  status: String;
  organization: IOrganization;
}

const UserInviteSchema: Schema = new Schema(
  {
    userEmail: String,
    status: String,
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  {
    collection: 'userinvites',
    timestamps: true,
    versionKey: false,
  }
);

export const UserInviteModel: Model<IUserInvite> =
  connections.db.model<IUserInvite>('UserInvite', UserInviteSchema);
