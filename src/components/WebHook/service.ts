import WebHookModel, { IWebHook } from './model';
const { Octokit } = require('@octokit/core');
import config from '../../config/env';

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

    async findOne(query: Partial<IWebHook>): Promise<IWebHook> {
        try {
            return WebHookModel.findOne(query);
        } catch(error) {
            throw new Error(error.message);
        }
    },


    async find(query: Partial<IWebHook>): Promise<Array<IWebHook>> {
        try {
            return WebHookModel.find(query);
        } catch(error) {
            throw new Error(error.message);
        }
    },

    async update(id: string, query: Partial<IWebHook>): Promise<IWebHook> {
        try {
            return WebHookModel.updateOne({ _id: id }, query);
        } catch(error) {
            throw new Error(error.message);
        }
    },

    async remove(id: string): Promise<any> {
        try {
            return WebHookModel.deleteOne({ _id: id });
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

    async disconnectWithGithub(installationToken: any, parsed: any, hookId: number): Promise<any> {
        try {

            const octokit: any = new Octokit({ auth: `${installationToken.token}` });
            const response: any = await octokit.request(
                'DELETE /repos/{owner}/{repo}/hooks/{hook_id}',
                {
                    owner: parsed.owner,
                    repo: parsed.name,
                    hook_id: hookId,
                }
            );

            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getGitHook(installationToken: any, parsed: any, hookId: number): Promise<any> {
        try {

            const octokit: any = new Octokit({ auth: `${installationToken.token}` });
            const response: any = await octokit.request(
                'GET /repos/{owner}/{repo}/hooks/{hook_id}',
                {
                    owner: parsed.owner,
                    repo: parsed.name,
                    hook_id: hookId,
                }
            );

            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default WebHookService;

