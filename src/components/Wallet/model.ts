import * as connections from "../../config/connection/connection";
import { Document, Schema } from "mongoose";
import { IOrganization } from "../Organization/model";

export interface IWalletModel extends Document {
  address: string;
  organizationId:  IOrganization['_id'];
}

const WalletSchema: Schema = new Schema(
  {
    address: { type: String },
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
    }
  },
  {
    collection: "wallets",
    timestamps: true,
    versionKey: false,
  }
);

export default connections.db.model<IWalletModel>("WalletModel", WalletSchema);
