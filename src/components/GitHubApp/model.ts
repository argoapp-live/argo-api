import { number } from "joi";
import { Schema, Types, Document } from "mongoose";
import * as connections from '../../config/connection/connection';


export interface IGuHubAppToken {
    gitHubId: number;
    argoUserId: Types.ObjectId;
    installationId: number;
    token: string;
}


export interface IGitHubAppTokenModel extends Document {
    gitHubId: number;
    argoUserId: Types.ObjectId;
    installationId: number;
    token: string;
}

const GitHubAppTokenSchema: Schema = new Schema({
    gitHubId: Number,
    argoUserId: Schema.Types.ObjectId,
    installationId: Number,
    token: String
}, {
    collection: 'githubtokens',
    timestamps: true,
    versionKey: false
});

export default connections.db.model<IGitHubAppTokenModel>('GitHubAppTokenModel', GitHubAppTokenSchema);