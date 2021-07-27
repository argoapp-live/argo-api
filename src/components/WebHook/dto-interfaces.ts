export interface IWebHookRequest {
    name: string,
    projectId: string, 
    configurationId: string, 
    organizationId: string,
    installationId: number,
}

export interface IWebHookConnectionRequest {
    projectId: string, 
    installationId: number,
}