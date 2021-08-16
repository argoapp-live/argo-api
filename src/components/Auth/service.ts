import { Types } from "mongoose";
import config from "../../config/env";
import { IUserModel, IUser } from "../User/model";
import { IAuthService } from "./interface";
import { Request } from "express";
import JWTTokenService from "../Session/service";
import axios from "axios";

/**
 * @export
 * @implements {IAuthService}
 */
const AuthService: IAuthService = {
  /**
   * @param {IUserModel} body
   * @returns {Promise <IUserModel>}
   * @memberof AuthService
   */
  async findProfileOrCreate(body: IUser): Promise<IUserModel> {
    try {
      const saved: IUserModel = (
        await axios.post(
          `${config.authApi.HOST_ADDRESS}/auth/findProfileOrCreate`,
          body
        )
      ).data;
      return saved;
    } catch (error) {
      throw new Error(error);
    }
  },

  async authUser(req: Request): Promise<IUserModel> {
    try {
      const saved: IUserModel = (
        await axios.post(`${config.authApi.HOST_ADDRESS}/auth/authUser`, req)
      ).data;
      return saved;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default AuthService;
