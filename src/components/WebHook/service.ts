import WebHookModel, { IWebHook } from './model';
import GithubAppService from '../GitHubApp/service';
import AuthService from '../Auth/service';
const { Octokit } = require('@octokit/core');
import { Request } from 'express';
import config from '../../config/env';
import { IConfiguration } from '../Configuration/model';
import ConfigurationService from '../Configuration/service';

const WebHookService = {

    async findById(id: string): Promise<IWebHook> {
        try {
          return WebHookModel.findById(id);
        } catch (error) {
          throw new Error(error.message);
        }
    },

    async create(name: string, projectId: string, configurationId: string, installationId: string, organizationId: string, installationToken: any, parsed: any): Promise<any> {
        try {
            // const webHookCreationDto = req.body as IWebHook;
            // const decodeToken: any = await AuthService.deseralizeToken(req);
            //Why we need this?
            // const argoSession: IArgoSessionModel = await JWTTokenService.FindOneBySessionId(
            //     decodeToken.session_id
            // );
            // let installationToken = await GithubAppService.createInstallationToken(req.body.installationId);

            const webHook = await WebHookModel.create({ name, projectId, configurationId, installationId, organizationId });

            const octokit: any = new Octokit({ auth: `${installationToken.token}` });
            const response: any = await octokit.request(
                'POST /repos/{owner}/{repo}/hooks',
                {
                    owner: parsed.owner,
                    repo: parsed.name,
                    events: ['push'],
                    config: {
                        url: `${config.selfUrl}/webhook/trigger/${webHook.id}`,
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

