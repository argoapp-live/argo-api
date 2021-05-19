import { NextFunction, Request, Response } from 'express';
import HttpError from '../../config/error';
import config from '../../config/env/index';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { DeploymentModel, IDeployment, IOrganization, RepositoryModel } from '../Organization/model';
import { IWalletModel } from '../Wallet/model';
import { IInternalApiDto } from './interface';
import DeploymentService from './service';
import { Types } from 'mongoose';
import JWTTokenService from '../Session/service';
import UserService from '../User/service';
import { IUserModel } from '../User/model';
import RepositoryService from '../Repository/service';
import OrganizationService from '../Organization/service';
const { createAppAuth } = require("@octokit/auth-app");
const fs = require('fs');
const path = require('path');
const fullPath = path.join(__dirname, `../../templates/user-org-invite/${config.githubApp.PEM_FILE_NAME}`);

const readAsAsync = fs.readFileSync(fullPath, 'utf8');
const io: any = require('socket.io-client');

const emitter: any = require('socket.io')();
const socket: any = io(config.flaskApi.BASE_ADDRESS);


async function _deseralizeToken(req: Request) {
    const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
    return JWTTokenService.VerifyToken(argoDecodedHeaderToken);
}

async function _auth(req: Request): Promise<IUserModel> {
    const deserializedToken: any = await _deseralizeToken(req);
    const user: IUserModel = await UserService.findOne(deserializedToken.session_id);

    const { orgId }: { orgId: string } = req.body;
    const organization: IOrganization = await OrganizationService.findOne(orgId);

    if(!organization) {
        return null;
    }
        
    const isUserInOrganization: boolean = user.organizations.some((orgUser) => {
        return orgUser._id.equals(orgId)
    });

    if (!isUserInOrganization) {
        return null;
    }
    return user;
}

async function _getFullGithubUrlAndFolderName(githubUrl: string, isPrivate: boolean, branch: string, installationId: string, repositoryId: string, owner: string): Promise<Array<string>> {
    const splitUrl: Array<string> = githubUrl.split('/');
    const folderName: string = splitUrl[splitUrl.length - 1].slice(0, -4);

    if (isPrivate) {
        let installationToken = await createInstallationToken(installationId, repositoryId);
        return [`https://x-access-token:${installationToken.token}@github.com/${owner}/${folderName}.git`, folderName];
    }
    else {
        return [`${githubUrl} --branch ${branch}`, folderName];
    }
}



export async function newDeploy(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { orgId, github_url, isPrivate, owner, branch, repositoryId, installationId, uniqueTopicId, framework, package_manager, build_command, workspace, publish_dir }: 
        { orgId: string, github_url: string, isPrivate: boolean, owner: string, branch: string, repositoryId: string, installationId: string
            uniqueTopicId: string, framework: string, package_manager: string, build_command: string, workspace: string, publish_dir: string } = req.body;
    const user: IUserModel = await _auth(req);

    if(!user) {
        //return error
    }

    const [fullGitHubPath, folderName]: Array<string> = await _getFullGithubUrlAndFolderName(github_url, isPrivate, branch, installationId, repositoryId, owner);

    const deploymentObj: any = await DeploymentService.create(uniqueTopicId, branch, package_manager, publish_dir, build_command, framework, github_url, workspace);
    console.log('Ovdeeee', orgId);
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

export async function FindDeploymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const deployment: IDeployment = await DeploymentService.FindOneDeployment(req.params.id);

    res.status(200).json({
        deployment,
        success: true,
    });
}

const createInstallationToken = async (installationId: any, repositoryId: any) => {
    const auth = await createAppAuth({
        id: config.githubApp.GIT_HUB_APP_ID,
        privateKey: readAsAsync,
        installationId: installationId,
        clientId: config.githubApp.GITHUB_APP_CLIENT_ID,
        clientSecret: config.githubApp.GITHUB_APP_CLIENT_SECRET,
    });
    const authToken = await auth({ type: "app" });
    const installationToken = await auth({ type: "installation" });
    return installationToken;
}
