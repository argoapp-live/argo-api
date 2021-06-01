import { Types } from "mongoose";
import { IDeployment, DeploymentModel } from './model';
import { IDeploymentService } from "./service-interface";


const DeploymentService: IDeploymentService = {
    async create(topic: string, projectId: string, configurationId: string): Promise<IDeployment> {

        const deployment: any = {
            topic,
            project: projectId,
            configuration: configurationId
        };
        
        return DeploymentModel.create(deployment);
    },

    async findById(id: string): Promise<IDeployment> {
        return DeploymentModel.findById(id);
    },

    async updateFinishedDeployment(deploymentId: string, sitePreview: string, status: string, buildTime: number, logs: Array<string>): Promise<IDeployment> {
        const condition = {
            '_id': Types.ObjectId(deploymentId)
        }

        const update = {
            sitePreview,
            status,
            buildTime,
            logs,
        }

        return DeploymentModel.findOneAndUpdate(condition, update);
    },

    async updatePayment(deploymentId: string, paymentId: string): Promise<IDeployment> {
        const condition = {
            '_id': Types.ObjectId(deploymentId)
        }
        
        const update = {
            paymentId,
        }

        return DeploymentModel.findOneAndUpdate(condition, update);
    }
}

export default DeploymentService;