import { IDeployment } from "./model";

export interface IDeploymentService {
    create(topic: string, projectId: string, configurationId: string): Promise<IDeployment>;
    findById(id: string): Promise<IDeployment>;
    findLatest(id: string): Promise<IDeployment>;
    find(query: Partial<IDeployment>): Promise<Array<IDeployment>>;
    updateFinishedDeployment(deploymentId: string, sitePreview: string, deploymentStatus: string, buildTime: number, logs: Array<string>): Promise<IDeployment>;
    updatePayment(deploymentId: string, paymentId: string): Promise<IDeployment>;
}