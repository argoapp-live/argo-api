import { Request } from 'express';

export interface IInternalApiDto {
  github_url: string;
  folder_name: string;
  topic: string;
  package_manager: string;
  branch: string;
  build_command: string;
  publish_dir: string;
}

/**
 * @export
 * @interface IWebHookService
 */
export interface IWebHookService {
  /**
   * @param {IWebHookService} IUserInvite
   * @returns {Promise<IWebHook>}
   * @memberof IWebHookService
   */
  createHook(req: Request): Promise<any>;
}
