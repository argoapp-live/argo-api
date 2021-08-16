import { Types } from "mongoose";
import { IDeployment, DeploymentModel } from "./model";
import { IDeploymentService } from "./service-interface";

const DeploymentService: IDeploymentService = {
  async create(
    topic: string,
    projectId: string,
    configurationId: string,
    deploymentEnv: any,
    commitId: string,
    commitMessage: string
  ): Promise<IDeployment> {
    const deployment: any = {
      topic,
      project: projectId,
      configuration: configurationId,
      env: deploymentEnv,
      commitId,
      commitMessage,
    };

    return DeploymentModel.create(deployment);
  },

  async findById(id: string): Promise<IDeployment> {
    return DeploymentModel.findById(id)
      .populate("configuration")
      .populate("project");
  },

  async findOne(query: Partial<IDeployment>): Promise<IDeployment> {
    return DeploymentModel.findOne(query).populate("configuration");
  },

  async findLatest(projectId: string): Promise<IDeployment> {
    const latest = await DeploymentModel.find({
      project: Types.ObjectId(projectId),
    })
      .sort({ updatedAt: "desc" })
      .populate("configuration");
    return latest[0];
  },

  async findLatestDeployed(projectId: string): Promise<IDeployment> {
    const latest = await DeploymentModel.find({
      project: Types.ObjectId(projectId),
      status: "Deployed",
    })
      .sort({ updatedAt: "desc" })
      .populate("configuration");
    return latest[0];
  },

  async find(query: Partial<IDeployment>): Promise<Array<IDeployment>> {
    return DeploymentModel.find(query)
      .populate("configuration")
      .populate("project");
  },

  async updateFinishedDeployment(
    deploymentId: string,
    sitePreview: string,
    status: string,
    buildTime: number,
    logs: Array<string>
  ): Promise<IDeployment> {
    const condition = {
      _id: Types.ObjectId(deploymentId),
    };

    const update = {
      sitePreview,
      status,
      buildTime,
      logs,
    };

    return DeploymentModel.findOneAndUpdate(condition, update);
  },

  async updatePayment(
    deploymentId: string,
    paymentId: string
  ): Promise<IDeployment> {
    const condition = {
      _id: Types.ObjectId(deploymentId),
    };

    const update = {
      paymentId,
    };

    return DeploymentModel.findOneAndUpdate(condition, update);
  },
};

export default DeploymentService;
