import { Types } from "mongoose";
import { IDeployment } from "../Organization/model";


export interface IDeploymentService {

    createAndDeployRepo(body: any, topic: string): Promise<Types.ObjectId>;
    FindOneDeployment(deploymentId: string): Promise<IDeployment>;
    updateStatus(deploymentId: string, status: string): Promise<IDeployment>;
    updatePayment(deploymentId: string, paymentId: string): Promise<IDeployment>;
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