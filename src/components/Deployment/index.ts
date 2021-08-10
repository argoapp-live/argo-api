import { NextFunction, Request, Response } from "express";
import config from "../../config/env/index";
import axios from "axios";
import DeploymentService from "./service";
import { IUserModel } from "../User/model";
import GithubAppService from "../GitHubApp/service";
import AuthService from "../Auth/service";
import { IRequestBody, IDeploymentBody } from "./dto-interfaces";
import { IProject } from "../Project/model";
import ProjectService from "../Project/service";
import ConfigurationService from "../Configuration/service";
import { IConfiguration } from "../Configuration/model";
import { IDeployment } from "./model";
import DomainService from "../Domain/service";
import { IWalletModel } from "../Wallet/model";
import WalletService from "../Wallet/service";
import { ICommitInfo } from "../GitHubApp/service";
import { IWebHook } from "../WebHook/model";
import * as toDelete from "./../SQSProducer";
console.log(toDelete);
import WebHookService from "../WebHook/service";
import { ISubscription } from "../Subscription/model";
import SubscriptionService from "../Subscription/service";
import SubscriptionPackageService from "../SubscriptionPackage/service";
import { ISubscriptionPackage } from "../SubscriptionPackage/model";
const gh = require('parse-github-url');

const DEFAULT_WEBHOOK_NAME = 'production';


export async function deployFromRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.body as IRequestBody;

  const {
    organizationId,
    githubUrl,
    folderName,
    owner,
    installationId,
    uniqueTopicId,
    configurationId,
    env,
    createDefaultWebhook
  } = req.body;

  const user: IUserModel = await AuthService.authUser(req);

  if (!user) {}

  const wallet: IWalletModel = await WalletService.findOne({ organizationId });

  const result: any = await ProjectService.createIfNotExists(
    githubUrl,
    organizationId,
    folderName,
    env
  );
  const project = result.project;
  const deploymentEnv = result.project.env;
  const created = result.created;

  if (created) {
    try {
      await DomainService.addDefault(project);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  //TODO if (createDefaultWebhook && created)
  if (createDefaultWebhook) {
    try {
      const installationToken = await GithubAppService.createInstallationToken(installationId);
      const parsed = gh(githubUrl);
      const configuration: IConfiguration = await ConfigurationService.findById(
        configurationId
      );
      await WebHookService.connectWithGithub(project.id, installationToken, parsed);
      await WebHookService.create(DEFAULT_WEBHOOK_NAME, project.id, configurationId, installationId, organizationId, configuration.branch);
    } catch(err) {
      console.log('WebHook err', err.message);
    }
  }
  const activeSubscription :ISubscription = await SubscriptionService.findOne({organizationId, status : 'ACTIVE'});
  let responseObj: any;
  if(activeSubscription){
    const constraintsSatisfied : Boolean = await checkSubscriptionConstraints(activeSubscription,organizationId);
    if(!constraintsSatisfied){
      res.status(200).json({
        message : "Subscription constraints not satisfied"
      })
      return;
    }
    responseObj = await deploy(githubUrl, installationId, owner, folderName, uniqueTopicId, project, configurationId, wallet, deploymentEnv,true);
  }else { 
    responseObj = await deploy(githubUrl, installationId, owner, folderName, uniqueTopicId, project, configurationId, wallet, deploymentEnv, false);    
  }
  res.status(200).json(responseObj);
}

// async function deployFromWebHook() {
  
// }
async function checkSubscriptionConstraints(subscription : ISubscription, organizationId : string) : Promise<Boolean>{
  const subscriptionPackage : ISubscriptionPackage = await SubscriptionPackageService.findById(subscription.subscriptionPackageId);
  // checking constratint {numberOfDeployments}
  let numberOfDeploymentsForOrganization = 0 ;
  const projects : IProject[] = await ProjectService.find({organizationId});
  projects.forEach(async p => {    
    const pDeployments : IDeployment[]  = await DeploymentService.find({project : p.id });
    pDeployments.forEach(d => { 
      let createdAtTimestamp = Date.parse(d.createdAt);
      if(createdAtTimestamp > subscription.dateOfIssue){
        numberOfDeploymentsForOrganization++;
      }
    })
  });
  if(numberOfDeploymentsForOrganization>subscriptionPackage.numberOfAllowedDeployments){
    return false;
  }
  return true;
}
export async function deploy(githubUrl: string, installationId: number, owner: string, folderName: string,
    uniqueTopicId: string, project: IProject, configurationId: string, wallet: IWalletModel, deploymentEnv: any, withSubscription : boolean) {

      const configuration: IConfiguration = await ConfigurationService.findById(
        configurationId
      );
    
      if (!configuration) {}
      const {
        branch,
        buildCommand,
        packageManager,
        publishDir,
        protocol,
        framework,
        workspace,
      } = configuration;

  const fullGitHubPath: string =
    await GithubAppService.getFullGithubUrlAndFolderName(
      branch,
      installationId,
      owner,
      folderName
    );

  const commitInfo: ICommitInfo = await GithubAppService.getLatestCommitInfo(installationId, githubUrl, branch);

  const deployment: IDeployment = await DeploymentService.create(
    uniqueTopicId,
    project._id,
    configurationId,
    deploymentEnv,
    commitInfo.id,
    commitInfo.message
  );

  let logsToCapture;

  switch (protocol) {
    case "arweave":
      logsToCapture = config.arweave.LOGSTOCAPTURE;
      break;
    case "skynet":
      logsToCapture = config.skynet.LOGSTOCAPTURE;
      break;
    case "neofs":
      logsToCapture = config.neofs.LOGSTOCAPTURE;
      break;
  }

  const body: IDeploymentBody = {
    deploymentId: deployment._id,
    githubUrl: fullGitHubPath,
    folderName,
    topic: !!uniqueTopicId ? uniqueTopicId : "random-topic-url",
    framework,
    packageManager,
    branch,
    buildCommand,
    publishDir,
    protocol,
    workspace: !!workspace ? workspace : "",
    is_workspace: !!workspace,
    logsToCapture,
    walletId: !!wallet._id ? wallet._id : "abcdefghij",
    walletAddress: !!wallet.address ? wallet.address : "0x123456789",
    env: deploymentEnv,
  };

  await ProjectService.setLatestDeployment(project._id, deployment._id);
  if(!withSubscription){
    axios
      .post(`${config.deployerApi.HOST_ADDRESS}/deploy`, body)
      .then((response: any) => console.log("FROM DEPLOYMENT", response.data));
  }else { 
    axios
      .post(`${config.deployerApi.HOST_ADDRESS}/deployWithSubscription`, body)
      .then((response: any) => console.log("FROM DEPLOYMENT", response.data));
  }
  return {
    message: "Deployment is being processed",
    success: true,
    topic: uniqueTopicId,
    deploymentId: deployment._id,
    projectId: project._id,
  }
}

export async function deploymentFinished(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("DEPLOYMENT FINISHED", req.body);
  try {
    const { deploymentId, capturedLogs, deploymentStatus, buildTime, logs } =
      req.body;
    const sitePreview =
      Object.keys(capturedLogs).length === 0 ? "" : capturedLogs.sitePreview;

    await DeploymentService.updateFinishedDeployment(
      deploymentId,
      sitePreview,
      deploymentStatus,
      buildTime,
      logs
    );

    res.status(201).json({
      msg: "successfuly updated",
    });
  } catch (err) {
    console.log(err.message);
  }
}

export async function paymentFinished(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("Payment finished", req.body);
  const {
    paymentId,
    deploymentId,
    status,
  }: { paymentId: string; deploymentId: string; status: string } = req.body;

  let deployment: IDeployment = await DeploymentService.findById(deploymentId);

  if (status === "created") {
    deployment = await DeploymentService.updatePayment(deploymentId, paymentId);
    res.status(201).json({ msg: "Payment successfully recorded" });
  }

  if (deployment.status === "Deployed" && status === "success") {
    DomainService.addToResolver(deployment.project, deployment.sitePreview);
  }
}

export async function findDeploymentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const deployment: any = await DeploymentService.findById(req.params.id);

  if (deployment.status === "Pending") {
    const liveLogs = await axios.post(
      `${config.deployerApi.HOST_ADDRESS}/deploy/liveLogs`,
      { deploymentId: deployment._id }
    );

    deployment.logs = !liveLogs.data.logs ? [] : liveLogs.data.logs;
  }
  const paymentDetails = await axios.get(
    `${config.paymentApi.HOST_ADDRESS}/payments/deployment/${deployment._id}`
  );

  deployment._doc.payment = paymentDetails.data;

  res.status(200).json({
    deployment,
  });
}
