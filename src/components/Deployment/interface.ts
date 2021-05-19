import { Types } from "mongoose";
import { IDeployment } from "../Organization/model";


export interface IDeploymentService {

    create(topic: string, branch:string, package_manager: string, publish_dir: string, 
        build_command: string, framework: string, github_url: string, workspace: string): Promise<IDeployment>;
    createAndDeployRepo(body: any, topic: string): Promise<Types.ObjectId>;
    FindOneDeployment(deploymentId: string): Promise<IDeployment>;
    updateStatus(deploymentId: string, status: string): Promise<IDeployment>;
    updatePayment(deploymentId: string, paymentId: string): Promise<IDeployment>;
    // findPendingForOrganization(organizationId: string): Promise<any>;
}

export interface IInternalApiDto {
    github_url: string;
    folder_name: string;
    topic: string;
    framework: string;
    package_manager: string;
    branch: string;
    build_command: string;
    publish_dir: string;
    workspace: string;
    is_workspace: boolean;
}

export interface IDeploymentDto {
    sitePreview: string;
    commitId: string;
    log: [string];
    createdAt: any;
    topic: string;
    branch: string
    build_command: string;
    publish_dir: string;
    package_manager: string;
    deploymentStatus: string;
    github_url: string;
    framework: string;
    workspace: string;
}