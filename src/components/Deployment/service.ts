import { Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { DeploymentModel, IDeployment, IRepository, OrganizationModel, RepositoryModel } from "../Organization/model";
import RepositoryService from "../Repository/service"
import { IDeploymentDto, IDeploymentService } from "./interface";
import config from "../../config/env";


const DeploymentService: IDeploymentService = {

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
    }
}


const findOneAndCreateRepo = async (body: any, deploymentId: Types.ObjectId): Promise<any> => {
    const filter = {
        'url': body.github_url,
        'orgId': Types.ObjectId(body.orgId)
    }

    console.log('giturl: ', body.github_url);
    const findOneRepo: IRepository = await RepositoryModel.findOne(filter);

    if (findOneRepo) {

        console.log(findOneRepo);
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
    const organization = await OrganizationModel.findOneAndUpdate(orgFilter, updateOrg);

    try {
        const uuid: string = uuidv4();
        const dnsName: string = `${repository.name}.${organization.profile.username}.${config.googleCloud.dns.DNS_NAME}`;

        if(!RepositoryService.verifyDnsName(dnsName)) {
            throw new Error("dns name constraint violation");
        }

        await RepositoryService.addRecordToDnsZone
            (config.googleCloud.dns.DNS_ZONE_NAME, config.googleCloud.dns.RECORD_TYPE, dnsName, `argo=${uuid}`, config.googleCloud.dns.TTL);
    
        await RepositoryService.InsertSubDomain(repository._id, dnsName, '', true, uuid, true);
    } catch(error) {
        throw new Error(error.message);
    }

    return repository._id;
}

export default DeploymentService;