import { IDeployment } from "../Organization/model";


export interface IDeploymentService {

    create(topic: string, branch:string, package_manager: string, publish_dir: string, 
        build_command: string, framework: string, github_url: string, workspace: string): Promise<IDeployment>;
    findOne(deploymentId: string): Promise<IDeployment>;
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