import { Types } from "mongoose";
import { IGuHubAppToken } from "./model";


export interface IGitHubAppTokenService {
    findByUserId(id: Types.ObjectId): Promise<IGuHubAppToken>;
    findByInstallationAndUserId(id: Types.ObjectId, installationId: number): Promise<IGuHubAppToken>;
    create(gitHubToke: IGuHubAppToken): Promise<boolean>;
    findAndCreate(gitHubId: number, token: string, installationId: number): Promise<boolean>;
    remove(installationId: number): Promise<boolean>;
    createInstallationToken (installationId: any): Promise<any>;
    getFullGithubUrlAndFolderName(githubUrl: string, isPrivate: boolean, branch: string, installationId: string, repositoryId: string, owner: string): Promise<Array<string>>;
}