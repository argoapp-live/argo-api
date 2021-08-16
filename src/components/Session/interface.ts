/**
 * @export
 * @interface IArgoSerssionService
 */

import { IArgoSessionModel } from "./model";

export interface IArgoJwtTokenService {
  /**
   * @param {number} id
   * @returns {Promise<IArgoSessionModel>}
   * @memberof IArgoSessionModel
   */
  findSessionOrCreate(
    argoSessionDto: IArgoSessionDto
  ): Promise<IArgoSessionDto>;

  generateToken(argoSessionDto: IArgoSessionDto): Promise<string>;

  findOneByUserId(argo_username: string): Promise<IArgoSessionModel>;

  verifyToken(token: string): Promise<string>;

  decodeToken(req: any): Promise<any>;

  findAndRemove(sessionId: string): Promise<any>;

  findOneBySessionId(sessionId: string): Promise<IArgoSessionModel>;
}

export interface IArgoSessionDto {
  sessionId: string;
  accessToken: string;
  isActive: boolean;
}
