import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import { IUserModel } from '../User/model';
import WebHookService from './service';
import AuthService from '../Auth/service';
import { IWebHookRequest, IWebHookConnectionRequest } from './dto-interfaces';
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

        req.body as IWebHookConnectionRequest;
        const { projectId, installationId } = req.body;

        const project: IProject = await ProjectService.findById(projectId);
        if (!project) throw new Error('no project');
        if(project.gitHookId !== -1) {
            res.status(200).json({
                message: 'REPO CONNECTED'
            });
            return
        }

        const parsed = gh(project.githubUrl);

        const installationToken = await GithubAppService.createInstallationToken(installationId);
        const response = await WebHookService.connectWithGithub(projectId, installationToken, parsed);

        if (response.status === 201) {
            await ProjectService.updateOne(projectId, { gitHookId: response.data.id });
        } else {
            throw new Error('webhook not created');
        }

        res.status(200).json({
            message: 'REPO CONNECTED'
        });
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
        const { name, projectId, configurationId, installationId, orgId } = req.body;

        const project: IProject = await ProjectService.findById(projectId);
        if (!project) throw new Error('no project');
        
        const configuration: IConfiguration = await ConfigurationService.findById(configurationId);
        if (!configuration) throw new Error('no configuration');

        const existingWebHook1: IWebHook = await WebHookService.findOne({ projectId, branch: configuration.branch });
        if (existingWebHook1) throw new Error('webhook already exists');

        const existingWebHook2: IWebHook = await WebHookService.findOne({ projectId, name });
        if (existingWebHook2) throw new Error('webhook already exists');

        const webHook: IWebHook = await WebHookService.create(name, projectId, configurationId, 
            installationId, orgId, configuration.branch);
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

        const shouldTrigger = !!req.body.ref;

        if (!shouldTrigger) { 
            res.status(200).json({ msg: 'webhook created' }); 
            return;
        }

        const refParsed = req.body.ref.split('/')
        const branch = refParsed[refParsed.length - 1];
        const webHook: IWebHook = await WebHookService.findOne({ projectId, branch });
        if (!webHook) throw new Error('no hook with that id');

        const wallet: IWalletModel = await WalletService.findOne({ organizationId: webHook.organizationId });

        const project: IProject = await ProjectService.findById(webHook.projectId);
        const parsed = gh(project.githubUrl);

        const responseObj: any = await DeploymentComponent.deploy(project.githubUrl, webHook.installationId, 
            parsed.owner, parsed.name, uuidv4(), project, webHook.configurationId, wallet, project.env);

        console.log('WEBHOOK_TRIGGERED', responseObj);

        res.status(200).json({ msg: 'webhook executed' });

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}


export async function update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
      try {
          const user: IUserModel = await AuthService.authUser(req);
          if (!user) throw new Error('unauthorized user');    
  
          const webHook: IWebHook = await WebHookService.update(req.params.id, req.body);
          res.status(201).json({success: true, webHook});
  
      } catch (error) {
          next(new HttpError(error.message.status, error.message));
      }
}

export async function remove(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {

        const user: IUserModel = await AuthService.authUser(req);
        if (!user) throw new Error('unauthorized user'); 

        await WebHookService.remove(req.params.id);
        res.status(200).json({success: true });

    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

