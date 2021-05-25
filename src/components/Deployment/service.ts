import { Types } from "mongoose";
import { DeploymentModel, IDeployment } from "../Organization/model";
import { IDeploymentService } from "./service-interface";


const DeploymentService: IDeploymentService = {
    async create(topic: string, branch:string, package_manager: string, publish_dir: string, 
        build_command: string, framework: string, github_url: string, workspace: string): Promise<IDeployment> {

        const deployment: any = {
            topic: topic,
            branch: branch,
            package_manager: package_manager,
            build_command: build_command,
            publish_dir: publish_dir,
            github_url: github_url,
            framework: framework,
            workspace: workspace
        };
        
        return DeploymentModel.create(deployment);
    },

    async findOne(deploymentId: string): Promise<IDeployment> {
        const filter = {
            '_id': Types.ObjectId(deploymentId)
        }
        const deployment: IDeployment = await DeploymentModel.findById(filter);
        return deployment;
    },

    async updateFinishedDeployment(deploymentId: string, sitePreview: string, deploymentStatus: string, buildTime: number, logs: Array<string>): Promise<IDeployment> {
        const condition = {
            '_id': Types.ObjectId(deploymentId)
        }

        const update = {
            sitePreview,
            deploymentStatus,
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