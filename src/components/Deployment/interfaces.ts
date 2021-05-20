export interface IRequestBody {
    orgId: string, 
    github_url: string, 
    isPrivate: boolean, 
    owner: string, 
    branch: string, 
    repositoryId: string, 
    installationId: string
    uniqueTopicId: string, 
    framework: string,
    package_manager: string, 
    build_command: string, 
    workspace: string, 
    publish_dir: string,
}

interface LogToCapture {
    key: string, 
    value: string,
}

export interface IDeploymentBody {
    deploymentId: string,
    githubUrl: string,
    folderName: string,
    topic: string,
    framework: string,
    packageMenager: string,
    branch: string,
    buildCommand: string,
    publishDir: string,
    workspace: string,
    is_workspace: boolean,
    logsToCapture: Array<LogToCapture>,
    walletId: string, 
    walletAddress: string
}


export interface IDeploymentCreated {
    deploymentId: string,
    sitePreview: string,
    deploymentStatus: string,
    logs: Array<string>
}