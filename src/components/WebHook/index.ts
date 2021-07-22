import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import { IUserModel } from '../User/model';
import WebHookService from './service';
import AuthService from '../Auth/service';
import { IWebHookRequest } from './dto-interfaces';
import GithubAppService from '../GitHubApp/service';
import { DeploymentComponent } from '..';
const gh = require('parse-github-url');
import ProjectService from '../Project/service';
const { Octokit } = require('@octokit/core');
import { IProject } from '../Project/model';
import { IOrganization } from '../Organization/model';
import OrganizationService from '../Organization/service';
import { IWalletModel } from '../Wallet/model';
import WalletService from '../Wallet/service';
import { v4 as uuidv4 } from "uuid";
import { IConfiguration } from '../Configuration/model';
import ConfigurationService from '../Configuration/service';
import { IWebHook } from './model';

export async function connect(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user: IUserModel = await AuthService.authUser(req);
        if (!user) throw new Error('unauthorized');

        req.body as IWebHookRequest;
        const { projectId, installationId } = req.body;

        const project: IProject= await ProjectService.findById(projectId);
        if (!project) throw new Error('no project');

        const parsed = gh(project.githubUrl);

        const installationToken = await GithubAppService.createInstallationToken(installationId);
        const response = await WebHookService.connectWithGithub(projectId, installationToken, parsed);

        res.status(200).json(response);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}


export async function createWebHook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user: IUserModel = await AuthService.authUser(req);
        if (!user) throw new Error('unauthorized');

        req.body as IWebHookRequest;
        const { name, projectId, configurationId, installationId, organizationId } = req.body;

        const project: IProject= await ProjectService.findById(projectId);
        if (!project) throw new Error('no project');
        
        const configuration: IConfiguration = await ConfigurationService.findById(configurationId);
        if (!configuration) throw new Error('no configuration');


        const webHook: IWebHook = await WebHookService.create(name, projectId, configurationId, installationId, organizationId, configuration.branch);
        res.status(200).json(webHook);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function triggerWebHook(
    req: Request,
    res: Response,
    next: NextFunction)
: Promise<void> {
    try {
        const projectId = req.params.projectId;

        const webHook: IWebHook = await WebHookService.findOne({ projectId, branch: req.body.ref });
        if (!webHook) throw new Error('no hook with that id');

        const wallet: IWalletModel = await WalletService.findOne({ organizationId: webHook.organizationId });

        const project: IProject = await ProjectService.findById(webHook.projectId);
        const parsed = gh(project.githubUrl);

        const responseObj: any = await DeploymentComponent.deploy(project.githubUrl, false, webHook.installationId, parsed.owner, 
            parsed.name, uuidv4(), project, webHook.configurationId, wallet);

        console.log('WEBHOOK_TRIGGERED', responseObj);

        res.status(200).json({ msg: 'webhook executed' });

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}

