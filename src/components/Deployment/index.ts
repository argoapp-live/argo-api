import { NextFunction, Request, Response } from 'express';
import config from '../../config/env/index';
import axios from 'axios';
import { IDeployment, OrganizationModel } from '../Organization/model';
import DeploymentService from './service';
import { IUserModel } from '../User/model';
import RepositoryService from '../Repository/service';
import OrganizationService from '../Organization/service';
import GithubAppService from '../GitHubApp/service';
import AuthService from '../Auth/service';
import { IRequestBody, IDeploymentBody } from './interfaces';


export async function deploy(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.body as IRequestBody;
    const { orgId, github_url, isPrivate, owner, branch, repositoryId, installationId, uniqueTopicId, framework, package_manager, build_command, workspace, publish_dir } = req.body;
    
    const user: IUserModel = await AuthService.authUser(req);
    if(!user) {
        //return error
    }

    const hasPendingDeployment: boolean = await OrganizationService.hasPendingDeployment(orgId);
    if (hasPendingDeployment) {
        //TODO return wait for pending deployment to finish
    }


    const [fullGitHubPath, folderName]: Array<string> = await GithubAppService.getFullGithubUrlAndFolderName(github_url, isPrivate, branch, installationId, repositoryId, owner);

    const deploymentObj: any = await DeploymentService.create(uniqueTopicId, branch, package_manager, publish_dir, build_command, framework, github_url, workspace);
    const repository = await RepositoryService.createOrUpdateExisting(github_url, orgId, deploymentObj._id, 
        branch, workspace, folderName, package_manager, build_command, publish_dir, framework);


    const body: IDeploymentBody = {
        githubUrl: fullGitHubPath,
        folderName,
        topic: !!uniqueTopicId ? uniqueTopicId : 'random-topic-url',
        framework: 'simplebash',
        packageMenager: package_manager,
        branch,
        buildCommand: build_command,
        publishDir: publish_dir,
        workspace: !!workspace ? workspace : '',
        is_workspace: !!workspace
    };

    axios.post(`${config.flaskApi.HOST_ADDRESS}`, body).then((response: any) => console.log('FROM DEPLOYMENT', response));

    res.status(200).json({
        message: 'Deployment is being processed',
        success: true,
        topic: uniqueTopicId,
        deploymentId: deploymentObj._id,
        repositoryId: repository._id,
    });

}

export async function findDeploymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const deployment: IDeployment = await DeploymentService.findOne(req.params.id);

    //TODO handle error

    res.status(200).json({
        deployment,
        success: true,
    });
}
