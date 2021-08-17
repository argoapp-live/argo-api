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

  VerifyToken(token: string): Promise<string>;
  DecodeToken(req: any): Promise<any>;

  FindAndRemove(session_id: string): Promise<any>;

  FindOneBySessionId(session_id: string): Promise<IArgoSessionModel>;
}

export interface IArgoSessionDto {
  session_id: string;
  access_token: string;
  is_active: boolean;
}
