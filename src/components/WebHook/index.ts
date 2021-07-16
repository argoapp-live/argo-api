import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import { IUserModel } from '../User/model';
import WebHookService from './service';
import AuthService from '../Auth/service';
import { IWebHookRequest } from './dto-interfaces';
import GithubAppService from '../GitHubApp/service';
const gh = require('parse-github-url');
import ProjectService from '../Project/service';
import { IProject } from '../Project/model';

export async function createWebHook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // const user: IUserModel = await AuthService.authUser(req);
        // if (!user) throw new Error('unauthorized');

        req.body as IWebHookRequest;
        const { name, projectId, configurationId, installationId, organizationId } = req.body;

        const project: IProject= await ProjectService.findById(projectId);
        if (!project) throw new Error('no project');

        const parsed = gh(project.githubUrl);

        const installationToken = await GithubAppService.createInstallationToken(installationId);

        const response = await WebHookService.create(name, projectId, configurationId, installationId, organizationId, installationToken, parsed);
        res.status(200).json(response);
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
        const id = req.params.id;

        const webHook = await WebHookService.findById(id);
        if (!webHook) throw new Error('no hook with that id');

        const project = await ProjectService.findById(webHook.projectId);

        console.log('WEBHOOK_TRIGGERED');
        console.log(webHook);
        console.log(project);

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}


