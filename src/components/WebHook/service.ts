import { IWebHookService } from './interface';
import { IWebHook } from './model';
import GithubAppService from '../GitHubApp/service';
import AuthService from '../Auth/service';
import { Octokit } from '@octokit/core';

import { Request } from 'express';

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

      // Why we need this?

      // const argoSession: IArgoSessionModel = await JWTTokenService.FindOneBySessionId(
      //     decodeToken.session_id
      // );

      const installationToken = await GithubAppService.createInstallationToken(
        req.body.installationId
      );
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
