import { IWebHookService } from './interface';
import { IWebHook } from './model';
import JWTTokenService from '../Session/service';
import { IArgoSessionModel } from '../Session/model';
import GithubAppService from '../GitHubApp/service';
import AuthService from '../Auth/service';
const { Octokit } = require('@octokit/core');
import config from '../../config/env/index';
import { Request } from 'express';
const { createAppAuth } = require("@octokit/auth-app");
const fs = require('fs');
const path = require('path');
const fullPath = path.join(__dirname, `../../templates/user-org-invite/${config.githubApp.PEM_FILE_NAME}`);
// const readAsAsync = fs.readFileSync(fullPath, 'utf8');

/**
 * @export
 * @implements {IWebHookService}
 */
const WebHookService: IWebHookService = {
    /**
     * @param {IUserInvite} userInvite
     * @returns {Promise <IUserInvite>}
     * @memberof InvitationService
     */
    async createHook(req: Request): Promise<any> {
        try {
            const webHookCreationDto = req.body as IWebHook;
            const decodeToken: any = await AuthService.deseralizeToken(req);
            
            //Why we need this?

            // const argoSession: IArgoSessionModel = await JWTTokenService.FindOneBySessionId(
            //     decodeToken.session_id
            // );

            let installationToken = await GithubAppService.createInstallationToken(req.body.installationId);
            const octokit: any = new Octokit({ auth: `${installationToken.token}` });
            const response: any = await octokit.request(
                'POST /repos/{owner}/{repo}/hooks',
                {
                    owner: webHookCreationDto.owner, // 'argoapp-live'
                    repo: webHookCreationDto.repo, // 'argo-api'
                    events: webHookCreationDto.events, // ['push']
                    config: {
                        // url: config.pushNotifyUrl, // URL from NGROK 'http://bbd64cf988c3.ngrok.io'
                        content_type: 'json',
                        insecure_ssl: '1',
                    },
                }
            );

            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default WebHookService;

