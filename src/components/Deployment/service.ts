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

    async createAndDeployRepo(body: any, topic: string): Promise<any> {
        // create deployment and
        const deployment: IDeploymentDto = {
            sitePreview: '',
            commitId: '00192',
            log: ['Build started'],
            createdAt: new Date(),
            topic: topic,
            branch: body.branch,
            package_manager: body.package_manager,
            build_command: body.build_command,
            publish_dir: body.publish_dir,
            deploymentStatus: "Pending",
            github_url: body.github_url,
            framework: body.framework,
            workspace: body.workspace
        };

        const deploymentModel: IDeployment = await DeploymentModel.create(deployment);
        // fetch repo with url name
        const repositoryId: any = await findOneAndCreateRepo(body, deploymentModel._id);
        return {
            deploymentId: deploymentModel._id,
            repositoryId: repositoryId._id
        }
    },
    async FindOneDeployment(deploymentId: string): Promise<IDeployment> {
        // create deployment and

        const filter = {
            '_id': Types.ObjectId(deploymentId)
        }
        const deployment: IDeployment = await DeploymentModel.findById(filter);
        return deployment;
    },

    async updateStatus(deploymentId: string, status: string): Promise<IDeployment> {
        const filter = { '_id': Types.ObjectId(deploymentId) }
        const update = { deploymentStatus: status };

        const deployment: IDeployment = await DeploymentModel.findOneAndUpdate(filter, update);
        return deployment;
    },

    async updatePayment(deploymentId: string, paymentId: string): Promise<IDeployment> {
        const filter = { '_id': Types.ObjectId(deploymentId) }
        const update = { paymentId: paymentId };

        const deployment: IDeployment = await DeploymentModel.findOneAndUpdate(filter, update);
        return deployment;
    }
}


const findOneAndCreateRepo = async (body: any, deploymentId: Types.ObjectId): Promise<any> => {
    const filter = {
        'url': body.github_url,
        'orgId': Types.ObjectId(body.orgId)
    }
    const findOneRepo: IRepository = await RepositoryModel.findOne(filter);
    if (findOneRepo) {
        const filter = {
            '_id': Types.ObjectId(findOneRepo._id)
        }
        const updateDeploymentId = {
            $addToSet: {
                deployments: [deploymentId]
            },
            updateDate: new Date()
        }
        await RepositoryModel.findOneAndUpdate(filter, updateDeploymentId);
        return findOneRepo._id;
    }

    const update = {
        name: body.folder_name,
        url: body.github_url,
        'webHook': "xyz",
        deployments: [deploymentId],
        orgId: Types.ObjectId(body.orgId),
        package_manager: body.package_manager,
        build_command: body.build_command,
        publish_dir: body.publish_dir,
        branch: body.branch,
        framework: body.framework,
        workspace: body.workspace
        
    };
    const repository: IRepository = await RepositoryModel.create(update);
    const orgFilter = {
        '_id': Types.ObjectId(body.orgId)
    };
    const updateOrg: any = {
        $addToSet: { repositories: [Types.ObjectId(repository._id)] },
    };
    await OrganizationModel.findOneAndUpdate(orgFilter, updateOrg);
    return repository._id;
}

export default DeploymentService;