import { NextFunction, Request, Response } from 'express';
import config from '../../config/env/index';
import axios from 'axios';
import { IDeployment, IRepository } from '../Organization/model';
import DeploymentService from './service';
import { IUserModel } from '../User/model';
import RepositoryService from '../Repository/service';
import OrganizationService from '../Organization/service';
import GithubAppService from '../GitHubApp/service';
import AuthService from '../Auth/service';
import { IRequestBody, IDeploymentBody, IDeploymentCreated } from './interfaces';


export async function deploy(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.body as IRequestBody;
    const { orgId, github_url, isPrivate, owner, branch, repositoryId, installationId, uniqueTopicId, 
        framework, package_manager, build_command, workspace, publish_dir } = req.body;
    
    const user: IUserModel = await AuthService.authUser(req);
    if(!user) {
        //return error
    }

    const hasPendingDeployment: boolean = await OrganizationService.hasPendingDeployment(orgId);
    if (hasPendingDeployment) {
        //TODO return wait for pending deployment to finish
    }

    const [fullGitHubPath, folderName]: Array<string> = await GithubAppService.getFullGithubUrlAndFolderName(github_url, isPrivate, branch, installationId, repositoryId, owner);

    const deployment: any = await DeploymentService.create(uniqueTopicId, branch, package_manager, publish_dir, build_command, framework, github_url, workspace);
    const repository = await RepositoryService.createOrUpdateExisting(github_url, orgId, deployment._id, 
        branch, workspace, folderName, package_manager, build_command, publish_dir, framework);

    deployment.repository = repository._id;
    await deployment.save();

    const organization: any = await OrganizationService.findOne(orgId);

    const body: IDeploymentBody = {
        deploymentId: deployment._id,
        githubUrl: fullGitHubPath,
        folderName,
        topic: !!uniqueTopicId ? uniqueTopicId : 'random-topic-url',
        framework,
        packageMenager: package_manager,
        branch,
        buildCommand: build_command,
        publishDir: publish_dir,
        workspace: !!workspace ? workspace : '',
        is_workspace: !!workspace,
        logsToCapture: [{ key: 'sitePreview', value: 'https://arweave.net' }],
        walletId: !!organization.wallet._id ? organization.wallet._id : 'abcdefghij',
        walletAddress: !!organization.wallet.address ? organization.wallet.address : '0x123456789'
    };

    axios.post(`${config.flaskApi.HOST_ADDRESS}`, body).then((response: any) => console.log('FROM DEPLOYMENT', response));

    res.status(200).json({
        message: 'Deployment is being processed',
        success: true,
        topic: uniqueTopicId,
        deploymentId: deployment._id,
        repositoryId: repository._id,
    });

}

export async function deploymentFinished(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('DEPLOYMENT FINISHED', req.body);
    try {
        const { deploymentId, capturedLogs, deploymentStatus, logs } = req.body;
        const sitePreview = Object.keys(capturedLogs).length === 0 ? '' : capturedLogs.sitePreview;
    
        await DeploymentService.updateFinishedDeployment(deploymentId, sitePreview, deploymentStatus, logs);
    
        res.status(201).json({
            msg: 'successfuly updated',
        });
    } catch(err) {
        console.log(err.message);
    }
}

export async function paymentFinished(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('Payment finished', req.body);
    const { paymentId, deploymentId }: { paymentId: string, deploymentId: string } = req.body;

    const deployment: IDeployment = await DeploymentService.updatePayment(deploymentId, paymentId);
    res.status(201).json({ msg: 'Payment successfully recorded'});

    if (deployment.deploymentStatus === 'Deployed') {
        const repo: IRepository = await RepositoryService.findOne(deployment.repository.toString());
        await RepositoryService.AddToProxy(repo, deployment.sitePreview, deployment._id);
    }
}


export async function findDeploymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const deployment: any = await DeploymentService.findOne(req.params.id);

    if (deployment.deploymentStatus === 'Pending') {
        const liveLogs = await axios.post(`${config.flaskApi.HOST_ADDRESS}liveLogs`, { deploymentId: deployment._id });
        deployment.logs = !liveLogs.data.logs ? [] : liveLogs.data.logs;
    }

    res.status(200).json({
        deployment
    });
}
