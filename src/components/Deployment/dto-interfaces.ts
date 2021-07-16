export interface IRequestBody {
    orgId: string, 
    githubUrl: string, 
    isPrivate: boolean, 
    owner: string, 
    branch: string, 
    projectId: string, 
    installationId: string
    uniqueTopicId: string, 
    configurationId: string,
    env: any,
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
    packageManager: string,
    branch: string,
    buildCommand: string,
    publishDir: string,
    protocol: string,
    workspace: string,
    is_workspace: boolean,
    logsToCapture: Array<LogToCapture>,
    walletId: string, 
    walletAddress: string,
    env: any,
}


export interface IDeploymentCreated {
    deploymentId: string,
    sitePreview: string,
    deploymentStatus: string,
    logs: Array<string>
}