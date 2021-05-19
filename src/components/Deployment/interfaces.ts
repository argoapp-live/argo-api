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

export interface IDeploymentBody {
    githubUrl: string,
    folderName: string,
    topic: string,
    framework: string,
    packageMenager: string,
    branch: string,
    buildCommand: string,
    publishDir: string,
    workspace: string,
    is_workspace: boolean
}