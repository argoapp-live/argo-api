import * as connections from "../../config/connection/connection";
import { Document, Schema, Model } from "mongoose";
import { IConfiguration } from "../Configuration/model";
import { IProject } from "../Project/model";

export interface IDeployment extends Document {
  sitePreview: string;
  commitId: string;
  commitMessage: string;
  logs: [{ time: string; log: string }];
  topic: string;
  status: string;
  paymentId: string;
  buildTime: number;
  env: any;
  configuration: IConfiguration["_id"];
  project: IProject["_id"];
  createdAt: any;
  updatedAt: any;
  screenshot: IScreenshot;
}
export interface IScreenshot {
  id: string;
  fee: string;
  url: string;
}

const DeploymentSchema: Schema = new Schema(
  {
    sitePreview: String,
    commitId: String,
    commitMessage: { type: String, default: "" },
    logs: [{ time: String, log: String }],
    topic: String,
    status: { type: String, default: "Pending" },
    paymentId: String,
    env: Object,
    buildTime: { type: Number, default: 0 },
    configuration: {
      type: Schema.Types.ObjectId,
      ref: "ConfigurationModel",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "ProjectModel",
    },
    screenshot: {
      id: String,
      fee: String,
      url: String
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