
import * as connections from '../../config/connection/connection';
import { Document, Schema } from 'mongoose';

export interface IWalletModel extends Document {
    address: string;
    updateDate: Date;
    createDate: Date;
}

const WalletSchema: Schema = new Schema({
    address: { type: String },
    createDate: {
        type: Date, default: new Date()
    },
    updateDate: {
        type: Date, default: new Date()
    },
}, {
    collection: 'wallets',
    versionKey: false
});

export default connections.db.model<IWalletModel>('WalletModel', WalletSchema);
