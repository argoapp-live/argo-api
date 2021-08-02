import { HttpError } from '../../config/error';
import { IProject } from './model';
import { NextFunction, Request, Response } from 'express';
import JWTTokenService from '../Session/service';
import { IArgoSessionModel } from '../Session/model';
import GithubAppService from '../GitHubApp/service';
import ProjectService from './service';
import DeploymentService from '../Deployment/service';
import DomainService from '../Domain/service';
import WebHookService from '../WebHook/service';
const gh = require('parse-github-url');
const { Octokit } = require("@octokit/core");

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const project: any = await ProjectService.findById(req.params.id);
        if(project) {
            const deployments = await DeploymentService.find({ project: req.params.id });
            project._doc.deployments = deployments;
            const domains = await DomainService.find({ projectId: req.params.id });
            project._doc.domains = domains.filter(domain => domain.type === 'domain');
            project._doc.subdomains = domains.filter(domain => domain.type === 'subdomain');
            project._doc.handshakeDomains = domains.filter(domain => domain.type === 'handshake-domain');
            project._doc.handshakeSubdomains = domains.filter(domain => domain.type === 'handshake-subdomain');
        }
        res.status(200).json(project);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const repository: IProject = await ProjectService.insert(req.body, req.params.organizationId);
        res.status(201).json(repository);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function GetUserRepos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

        const getToken: any = await JWTTokenService.DecodeToken(req);
        const decodeToken: any = await JWTTokenService.VerifyToken(getToken);

        const argoSession: IArgoSessionModel = await JWTTokenService.FindOneBySessionId(decodeToken.session_id);

        const octokit = new Octokit({ auth: `${argoSession.access_token}` });
        const response = await octokit.request("GET /user/repos", {
            type: "all",
            per_page: 100
        });
        res.status(200).json(response);

    } catch (error) {
        throw new Error(error)
    }
}

export async function findOneAndUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

        const repository: boolean = await ProjectService.findOneAndUpdate(req.params.id, req.body)
        res.status(200).json({
            success: repository
        });

    } catch (error) {
        throw new Error(error)
    }
}

export async function getInstallationRepos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        const response = await GithubAppService.getInstallationRepos(deserializedToken.session_id, req.params.installationId);
        res.status(200).json({
            success: true,
            repositories: response.data.repositories
        });

    } catch (error) {
        throw new Error(error)
    }
}

export async function getBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        const response = await GithubAppService.getBranches(deserializedToken.session_id, req.query.branches);
        res.status(200).json({
            success: true,
            branches: response.data
        });

    } catch (error) {
        throw new Error(error)
    }
}

export async function updateEnv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const updatedProject: boolean = await ProjectService.updateEnv(req.params.id, req.body)
        res.status(200).json({
            updatedProject
        });

    } catch (error) {
        throw new Error(error)
    }
}

export async function changeStateToArchived(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

        const projectId: string = req.params.id;

        const project: IProject = await ProjectService.findById(projectId);
        if (project.state === 'ARCHIVED') {
            res.status(200).json({
                message: 'STATUS ALREADY ARCHIVED'
            });

            return next();
        }
        
        
        const { installationId } = req.body;
        const installationToken = await GithubAppService.createInstallationToken(installationId);
        const parsed = gh(project.githubUrl);
        const existsResponse = await WebHookService.getGitHook(installationToken, parsed, project.gitHookId);
        
        if (existsResponse.status === 200) {
            await WebHookService.disconnectWithGithub(installationToken, parsed, project.gitHookId);
        }
        
        await ProjectService.updateOne(req.params.id, { state: 'ARCHIVED', gitHookId: -1 });
        res.status(200).json({
            message: 'HOOK ALREADY DELETED',
        });

    } catch (error) {
        throw new Error(error)
    }
}


export async function changeStateToMaintained(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId: string = req.params.id;
        const project: IProject = await ProjectService.findById(projectId);

        if (project.state === 'MAINTAINED') {
            res.status(200).json({
                message: 'STATUS ALREADY MAINTAINED'
            });

            return next();
        }

        const updatedProject: IProject = await ProjectService.updateOne(projectId, { state: 'MAINTAINED' });
        
        const { installationId } = req.body;
        const installationToken = await GithubAppService.createInstallationToken(installationId);
        const parsed = gh(updatedProject.githubUrl);
        const existsResponse = await WebHookService.getGitHook(installationToken, parsed, project.gitHookId);

        if (existsResponse.status === 200) {
            res.status(200).json({
                message: 'HOOK ALREADY EXISTS'
            });

            return next();
        }

        const response: any = await WebHookService.connectWithGithub(projectId, installationId, parsed);

        if (response.status === 201) {
            await ProjectService.updateOne(projectId, { gitHookId: response.body.id });
        } else {
            throw new Error('webhook not created');
        }

        res.status(200).json({
            message: 'STATUS CHANGED TO MAINTAINED'
        });

    } catch (error) {
        throw new Error(error)
    }
}

