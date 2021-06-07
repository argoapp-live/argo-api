import { NextFunction, Request, Response } from 'express';
import config from '../../config/env/index';
import axios from 'axios';
import DeploymentService from './service';
import { IUserModel } from '../User/model';
import GithubAppService from '../GitHubApp/service';
import AuthService from '../Auth/service';
import { IRequestBody, IDeploymentBody } from './dto-interfaces';
import { IProject } from '../Project/model';
import ProjectService from '../Project/service';
import ConfigurationService from '../Configuration/service';
import { IConfiguration } from '../Configuration/model';
import { IDeployment } from './model';
import DomainService from '../Domain/service';
import { IWalletModel } from '../Wallet/model';
import WalletService from '../Wallet/service';


export async function deploy(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.body as IRequestBody;
    const { organizationId, githubUrl, isPrivate, folderName, owner, installationId, uniqueTopicId, configurationId } = req.body;

    const configuration: IConfiguration = await ConfigurationService.findById(configurationId);
    if (!configuration) {}
    const { branch, buildCommand, packageManager, publishDir, framework, workspace } = configuration;

    const user: IUserModel = await AuthService.authUser(req);
    if(!user) {}

    //TODO check pending deployment

    //TODO check wallet exists for the organization

    
    const result: any = await ProjectService.createIfNotExists(githubUrl, organizationId, folderName);
    const project = result.project;
    const created = result.created;

    console.log(project);

    if (created) {
        try {
            await DomainService.addDefault(project)
        } catch(err) {
            throw new Error(err.message);
        }
    }

    const fullGitHubPath: string = await GithubAppService.getFullGithubUrlAndFolderName(githubUrl, isPrivate, branch, installationId, owner, folderName);

    const deployment: IDeployment = await DeploymentService.create(uniqueTopicId, project._id, configurationId);
    const wallet: IWalletModel = await WalletService.findOne({ organizationId });

    const body: IDeploymentBody = {
        deploymentId: deployment._id,
        githubUrl: fullGitHubPath,
        folderName,
        topic: !!uniqueTopicId ? uniqueTopicId : 'random-topic-url',
        framework,
        packageManager,
        branch,
        buildCommand,
        publishDir,
        workspace: !!workspace ? workspace : '',
        is_workspace: !!workspace,
        logsToCapture: [{ key: 'sitePreview', value: 'https://arweave.net' }, { key: 'fee', value: 'Total price:' }],
        walletId: !!wallet._id ? wallet._id : 'abcdefghij',
        walletAddress: !!wallet.address ? wallet.address : '0x123456789'
    };

    axios.post(`${config.flaskApi.HOST_ADDRESS}`, body).then((response: any) => console.log('FROM DEPLOYMENT', response));

    res.status(200).json({
        message: 'Deployment is being processed',
        success: true,
        topic: uniqueTopicId,
        deploymentId: deployment._id,
        projectId: project._id
    });
}

export async function deploymentFinished(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('DEPLOYMENT FINISHED', req.body);
    try {
        const { deploymentId, capturedLogs, deploymentStatus, buildTime, logs } = req.body;
        const sitePreview = Object.keys(capturedLogs).length === 0 ? '' : capturedLogs.sitePreview;
    
        await DeploymentService.updateFinishedDeployment(deploymentId, sitePreview, deploymentStatus, buildTime, logs);
    
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

    if (deployment.status === 'Deployed') {
        const project: IProject = await ProjectService.findById(deployment.project);
        await ProjectService.setLatestDeployment(project._id, deployment._id);
        DomainService.addToResolver(project._id, deployment.sitePreview);
    }
}


export async function findDeploymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    let deployment: any = await DeploymentService.findById(req.params.id);

    if (deployment.deploymentStatus === 'Pending') {
        const liveLogs = await axios.post(`${config.flaskApi.HOST_ADDRESS}liveLogs`, { deploymentId: deployment._id });
        deployment.logs = !liveLogs.data.logs ? [] : liveLogs.data.logs;
    }
    const paymentDetails = await axios.get(`${config.paymentApi.HOST_ADDRESS}/deployment/${deployment._id}`);
    deployment._doc.payment = paymentDetails.data;

    res.status(200).json({
        deployment
    });
}
