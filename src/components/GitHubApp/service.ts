import { IGitHubAppTokenService } from "./interface";
import { IGuHubAppToken } from "./model";
import GitHubAppTokenModel from './model'
import { Types } from "mongoose";
import UserModel from "../User/model";
import config from '../../config/env/index';
import * as gh from 'parse-github-url';
const axios = require('axios').default;
const { Octokit } = require("@octokit/core");
const { createAppAuth } = require("@octokit/auth-app");
const fs = require('fs');
const path = require('path');

let gitPrivateKey: string;

if (config.githubApp.PEM_CONTENT_BASE64 !== '') {
    const base64Encoded: string = config.githubApp.PEM_CONTENT_BASE64;
    const buff: Buffer = new Buffer(base64Encoded, 'base64');

    gitPrivateKey = buff.toString('ascii');
} else {
    const gitPrivateKeyPath: string = path.join(__dirname, `../../templates/user-org-invite/${config.githubApp.PEM_FILE_NAME}`);

    gitPrivateKey = fs.readFileSync(gitPrivateKeyPath, 'utf8');
}

const HASH_BYTE_LEN = 40;

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
            "providerProfile.id": gitHubId
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
        await GitHubAppTokenModel.findOneAndRemove(filter);
        return true;
    },

    async createInstallationToken (installationId: any): Promise<any> {
        const auth = await createAppAuth({
            appId: config.githubApp.APP_ID,
            privateKey: gitPrivateKey,
            installationId: installationId,
            clientId: config.githubApp.CLIENT_ID,
            clientSecret: config.githubApp.CLIENT_SECRET,
        });
        const installationToken = await auth({ type: "installation" });
        return installationToken;
    },

    async getFullGithubUrlAndFolderName(branch: string, installationId: number, owner: string, folderName: string): Promise<string> {
        let installationToken = await GithubAppService.createInstallationToken(installationId);
        return `https://x-access-token:${installationToken.token}@github.com/${owner}/${folderName}.git --branch ${branch}`;
    },

    async getBranches(id: string, branchesQuery: any): Promise<any> {
        const getUserToken = await GitHubAppTokenModel.findOne({ argoUserId: id })
        const instanceAxiosBranch = axios.create({
            baseURL: branchesQuery,
            timeout: 5000,
            headers: {
                'authorization': `bearer ${getUserToken.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return instanceAxiosBranch.get();
        // return;
    },

    async getInstallationRepos(id: string, installationId: any): Promise<any> {
        const getUserToken = await GitHubAppTokenModel.findOne({ argoUserId: Types.ObjectId(id) });
        const instanceAxios = axios.create({
            baseURL: `https://api.github.com/user/installations/${installationId}/repositories`,
            timeout: 5000,
            headers: {
                'authorization': `bearer ${getUserToken.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return instanceAxios.get();
        // return;
    },

    async getLatestCommitInfo(installationId: number, githubUrl: string, branch: string): Promise<ICommitInfo> {
        try {
            const getUserToken = await GitHubAppTokenModel.findOne({ installationId });
            const octokit = new Octokit({ auth: getUserToken.token });

            const parsed: any = gh(githubUrl);
            const res:any = await octokit.request('GET /repos/{owner}/{repo}/commits', {
                owner: parsed.owner,
                repo: parsed.name,
                sha: branch,
                per_page: 1,
            });
            return { id: res.data[0].commit.url.split('commits/')[1], message: res.data[0].commit.message };
        } catch (error) {
            console.log(error);
            return { id: '', message: '' };
        }

    }
}

export interface ICommitInfo {
    id: string
    message: string,
}

export default GithubAppService;
