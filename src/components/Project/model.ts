import * as connections from "../../config/connection/connection";
import { Document, Schema, Model } from "mongoose";
import { IOrganization } from "../Organization/model";
import { IDeployment } from "../Deployment/model";

// /**
//  * @export
//  * @interface IProject
//  * @extends { Document }
//  */
export interface IProject extends Document {
  name: string;
  githubUrl: string;
  env: any;
  organizationId: IOrganization["_id"];
  latestDeployment: IDeployment["_id"];
  state: string;
  gitHookId: number;
}

const ProjectSchema: Schema = new Schema(
  {
    name: String,
    githubUrl: String,
    env: Object,
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    latestDeployment: {
      type: Schema.Types.ObjectId,
      ref: "Deployment",
      default: null,
    },
    state: {
      type: String,
      enum: ["MAINTAINED", "ARCHIVED"],
      default: "MAINTAINED",
    },
    gitHookId: { type: Number, default: -1 },
  },
  {
    collection: "projects",
    timestamps: true,
    versionKey: false,
  }
);

export const ProjectModel: Model<IProject> = connections.db.model<IProject>(
  "ProjectModel",
  ProjectSchema
);