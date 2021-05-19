import { NextFunction, Request, Response } from 'express';
import config from '../../config/env/index';
import axios from 'axios';
import { IDeployment } from '../Organization/model';
import DeploymentService from './service';
import { IUserModel } from '../User/model';
import RepositoryService from '../Repository/service';
import GithubAppService from '../GitHubApp/service';
import AuthService from '../Auth/service';


export async function deploy(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { orgId, github_url, isPrivate, owner, branch, repositoryId, installationId, uniqueTopicId, framework, package_manager, build_command, workspace, publish_dir }: 
        { orgId: string, github_url: string, isPrivate: boolean, owner: string, branch: string, repositoryId: string, installationId: string
            uniqueTopicId: string, framework: string, package_manager: string, build_command: string, workspace: string, publish_dir: string } = req.body;

    const user: IUserModel = await AuthService.authUser(req);

    if(!user) {
        //return error
    }

    const [fullGitHubPath, folderName]: Array<string> = await GithubAppService.getFullGithubUrlAndFolderName(github_url, isPrivate, branch, installationId, repositoryId, owner);

    const deploymentObj: any = await DeploymentService.create(uniqueTopicId, branch, package_manager, publish_dir, build_command, framework, github_url, workspace);
    const repository = await RepositoryService.createOrUpdateExisting(github_url, orgId, deploymentObj._id, 
        branch, workspace, folderName, package_manager, build_command, publish_dir, framework);


    const body: any = {
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
    const deployment: IDeployment = await DeploymentService.FindOneDeployment(req.params.id);

    //TODO handle error

    res.status(200).json({
        deployment,
        success: true,
    });
}
