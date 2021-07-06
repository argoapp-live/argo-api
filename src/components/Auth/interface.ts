import { IUserModel, IUser } from "../User/model";
import { Request } from "express";

/**
 * @export
 * @interface IAuthService
 */
export interface IAuthService {
  findProfileOrCreate(user: IUser): Promise<IUserModel>;
  deseralizeToken(req: Request): Promise<any>;
  authUser(req: Request): Promise<IUserModel>;
}
