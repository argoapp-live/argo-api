import { IGitHubAppTokenService } from "./interface";
import { IGuHubAppToken } from "./model";
import GitHubAppTokenModel from './model'
import { Types } from "mongoose";
import UserModel from "../User/model";
import config from '../../config/env/index';

const { createAppAuth } = require("@octokit/auth-app");
const fs = require('fs');
const path = require('path');
const fullPath = path.join(__dirname, `../../templates/user-org-invite/${config.githubApp.PEM_FILE_NAME}`);
const readAsAsync = fs.readFileSync(fullPath, 'utf8');


const GithubAppService: IGitHubAppTokenService = {
    async findByUserId(id: Types.ObjectId): Promise<IGuHubAppToken> {
        const filter = {
            argoUserId: id
        }
        const result = await GitHubAppTokenModel.findOne(filter);
        return result;
    },

    async findByInstallationAndUserId(id: Types.ObjectId, installationId: number): Promise<IGuHubAppToken> {
        const filter = {
            installationId: installationId,
            argoUserId: id
        }
        const result = await GitHubAppTokenModel.findOne(filter);
        return result;
    },

    async create(gitHubToken: IGuHubAppToken): Promise<boolean> {
        const filter = {
            installationId: gitHubToken.installationId,
            argoUserId: gitHubToken.argoUserId
        }
        await GitHubAppTokenModel.findOneAndUpdate(filter, gitHubToken);
        return true;
    },
    async findAndCreate(gitHubId: number, token: string, installationId: number): Promise<boolean> {
        const filter = {
            "provider_profile.id": gitHubId
        };
        const user = await UserModel.findOne(filter);
        if (user) {
            const filter = {
                installationId: installationId,
                argoUserId: user.id
            };
            const update: IGuHubAppToken = {
                argoUserId: user._id,
                gitHubId: gitHubId,
                installationId: installationId,
                token: token
            }
            const findOne = await GitHubAppTokenModel.findOne(filter);

            if (!findOne) {
                await GitHubAppTokenModel.create(update);
            }
            else {
                await GitHubAppTokenModel.findOneAndUpdate(filter, update);
            }
            return true;
        }
    },
    async remove(installationId: number): Promise<boolean> {
        const filter = {
            installationId: installationId
        }
        console.log(filter);
        await GitHubAppTokenModel.findOneAndRemove(filter);
        return true;
    },

    async createInstallationToken (installationId: any): Promise<any> {
        const auth = await createAppAuth({
            id: config.githubApp.GIT_HUB_APP_ID,
            privateKey: readAsAsync,
            installationId: installationId,
            clientId: config.githubApp.GITHUB_APP_CLIENT_ID,
            clientSecret: config.githubApp.GITHUB_APP_CLIENT_SECRET,
        });
        const authToken = await auth({ type: "app" });
        const installationToken = await auth({ type: "installation" });
        return installationToken;
    },

    async getFullGithubUrlAndFolderName(githubUrl: string, isPrivate: boolean, branch: string, installationId: string, repositoryId: string, owner: string): Promise<Array<string>> {
        const splitUrl: Array<string> = githubUrl.split('/');
        const folderName: string = splitUrl[splitUrl.length - 1].slice(0, -4);
    
        if (isPrivate) {
            let installationToken = await GithubAppService.createInstallationToken(installationId);
            return [`https://x-access-token:${installationToken.token}@github.com/${owner}/${folderName}.git`, folderName];
        }
        else {
            return [`${githubUrl} --branch ${branch}`, folderName];
        }
    }
}
export default GithubAppService;