import { Types } from "mongoose";
import * as nodemailer from "nodemailer";
import { IInvitationService } from "./interface";
import { IUserInvite, UserInviteModel } from "./model";
import config from "../../config/env/index";
import * as path from "path";
// tslint:disable-next-line: typedef
const EmailTemplate = require("email-templates").EmailTemplate;
// tslint:disable-next-line: typedef
const templatesDir = path.resolve(__dirname, "../../templates");

/**
 * @export
 * @implements {IInvitationService}
 */

const InvitationService: IInvitationService = {
  /**
   * @param {string} id
   * @returns {Promise <IUserInvite >}
   * @memberof InvitationService
   */
  async findOne(id: string): Promise<IUserInvite> {
    try {
      return await UserInviteModel.findOne({
        _id: Types.ObjectId(id),
      }).populate("organizations", "_id");
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {IUserInvite} userInvite
   * @returns {Promise <IUserInvite>}
   * @memberof InvitationService
   */
  async insert(body: IUserInvite): Promise<IUserInvite> {
    try {
      const user: IUserInvite = await UserInviteModel.create(body);

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {string} id
   * @returns {Promise <any>}
   * @memberof UserService
   */
  async findOneAndUpdate(
    inviteId: string,
    status: string
  ): Promise<IUserInvite> {
    try {
      const filter: any = {
        _id: inviteId,
      };
      const update: any = {
        status,
      };
      const updatedUser: any = await UserInviteModel.findOneAndUpdate(
        filter,
        update
      );

      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default InvitationService;
