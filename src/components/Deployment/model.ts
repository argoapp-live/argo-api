import * as connections from "../../config/connection/connection";
import { Document, Schema, Model } from "mongoose";
import { IConfiguration } from "../Configuration/model";
import { IProject } from "../Project/model";

export interface IDeployment extends Document {
  sitePreview: string;
  commitId: string;
  commitMessage: string;
  logs: [{ time: String; log: String }];
  topic: string;
  status: string;
  paymentId: string;
  buildTime: number;
  configuration: IConfiguration["_id"];
  project: IProject["_id"];
  createdAt: any;
  updatedAt: any;
}

const DeploymentSchema: Schema = new Schema(
  {
    sitePreview: String,
    commitId: String,
    commitMessage: { type: String, default: '' },
    logs: [{ time: String, log: String }],
    topic: String,
    status: { type: String, default: "Pending" },
    paymentId: String,
    buildTime: { type: Number, default: 0 },
    configuration: {
      type: Schema.Types.ObjectId,
      ref: "ConfigurationModel",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "ProjectModel",
    },
  },
  {
    collection: "deployments",
    timestamps: true,
    versionKey: false,
  }
);

export const DeploymentModel: Model<IDeployment> =
  connections.db.model<IDeployment>("Deployment", DeploymentSchema);
