import { Types } from "mongoose";
import { DeploymentModel, IDeployment, IRepository, OrganizationModel, RepositoryModel } from "../Organization/model";
import { IDeploymentDto, IDeploymentService } from "./interface";


const DeploymentService: IDeploymentService = {

    //TODO switch to camel case
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
        // create deployment and

        const filter = {
            '_id': Types.ObjectId(deploymentId)
        }
        const deployment: IDeployment = await DeploymentModel.findById(filter);
        return deployment;
    },
}

export default DeploymentService;