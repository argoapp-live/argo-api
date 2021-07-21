import { HttpError } from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import { IUserModel } from '../User/model';
import WebHookService from './service';
import AuthService from '../Auth/service';
import { IWebHookRequest } from './dto-interfaces';
import GithubAppService from '../GitHubApp/service';
const gh = require('parse-github-url');
import ProjectService from '../Project/service';
const { Octokit } = require('@octokit/core');
import { IProject } from '../Project/model';

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

        // const webHook = await WebHookService.findById(id);
        // if (!webHook) throw new Error('no hook with that id');

        // const project = await ProjectService.findById(webHook.projectId);

        // console.log(req);
        console.log('WEBHOOK_TRIGGERED', req);
        // console.log(webHook);
        // console.log(project);

        res.status(200).json({ msg: 'webhook executed' });

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function triggerWebHook2(
    req: Request,
    res: Response,
    next: NextFunction)
: Promise<void> {
    try {
        console.log(req);
        res.status(200).json({ msg: 'webhook executed' });

    } catch(error) {
        next(new HttpError(error.message.status, error.message));
    }
}


export async function testWebhook(
    req: Request,
    res: Response,
    next: NextFunction)
: Promise<void> {
    try {

        const { installationId } = req.body;
        const installationToken = await GithubAppService.createInstallationToken(installationId);

        console.log(installationToken);

        const octokit: any = new Octokit({ auth: `${installationToken.token}` });

        console.log('here');

        const response: any = await octokit.request(
            'POST /repos/{owner}/{repo}/hooks',
            {
                accept: "application/vnd.github.v3+json",
                owner: 'rekpero',
                repo: 'weavy',
                events: ['push'],
                config: {
                    url: "http://024557f07eab.ngrok.io/webhook/trigger/312312312",
                    token: installationToken.token,
                    insecure_ssl: 1,
                    content_type: 'json'
                },
            })

        res.status(200).json({ msg: 'hook created' });

    } catch(error) {
        console.log('err', error)
        next(new HttpError(error.message.status, error.message));
    }
}

