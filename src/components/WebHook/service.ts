import WebHookModel, { IWebHook } from './model';
const { Octokit } = require('@octokit/core');
import config from '../../config/env';
import { create } from '../User';

const WebHookService = {

    async findById(id: string): Promise<IWebHook> {
        try {
          return WebHookModel.findById(id);
        } catch (error) {
          throw new Error(error.message);
        }
    },

    async create(name: string, projectId: string, configurationId: string, installationId: string, organizationId: string, branch: string): Promise<IWebHook> {
        try {
            return WebHookModel.create({ name, projectId, configurationId, installationId, organizationId, branch });
        } catch(error) {
            throw new Error(error.message);
        }
    },

    async findOne(query: Partial<IWebHook>) {
        try {
            return WebHookModel.findOne(query);
        } catch(error) {
            throw new Error(error.message);
        }
    },

    async connectWithGithub(projectId: string, installationToken: any, parsed: any): Promise<any> {
        try {

            const octokit: any = new Octokit({ auth: `${installationToken.token}` });
            const response: any = await octokit.request(
                'POST /repos/{owner}/{repo}/hooks',
                {
                    owner: parsed.owner,
                    repo: parsed.name,
                    events: ['push'],
                    config: {
                        url: `${config.selfUrl}/webhook/trigger/${projectId}`,
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

