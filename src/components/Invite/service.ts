import { Types } from "mongoose";
import * as nodemailer from "nodemailer";
import { IInvitationService } from "./interface";
import { IUserInvite, UserInviteModel } from "./model";
import config from "../../config/env/index";
import * as path from "path";
import { IOrganization } from "../Organization/model";
// tslint:disable-next-line: typedef
const EmailTemplate = require("email-templates").EmailTemplate;
// tslint:disable-next-line: typedef
const templatesDir = path.resolve(__dirname, "../../templates");

/**
 * @export
 * @implements {IInvitationService}
 */

const InvitationService: IInvitationService = {
  async sendMail(
    to: string,
    inviteId: string,
    orgName: string,
    invitingUser: string
  ): Promise<string | undefined> {
    console.log(config.smtp.USERNAME, config.smtp.PASSWORD);
    let _transporter: nodemailer.Transporter;
    try {
      _transporter = nodemailer.createTransport({
        secure: true, // true for 465, false for other ports
        service: "gmail",
        auth: {
          user: config.smtp.USERNAME,
          pass: config.smtp.PASSWORD, // generated ethereal password
        },
      });

      const template: any = new EmailTemplate(
        path.join(templatesDir, "user-org-invite")
      );
      const inviteLink =
        config.frontendApp.HOST_ADDRESS +
        `/#/invite/callback?ref=${encodeURIComponent(
          inviteId
        )}&orgName=${encodeURIComponent(orgName)}`;
      const locals: any = {
        orgName,
        invitingUser,
        inviteLink: inviteLink,
      };

      template.render(locals, (err: any, results: any) => {
        if (err) {
          return console.error(err);
        }
        const options: any = {
          from: `"Argo Team" ${config.smtp.USERNAME}`, // sender address
          // tslint:disable-next-line: object-shorthand-properties-first
          to, // list of receivers
          subject: `Invitation to ArGo: ${orgName}`, // Subject line
          html: results.html,
          text: results.text,
        };

        _transporter.sendMail(options, (error, info) => {
          if (error) {
            return console.log(`error: ${error}`);
          }
          console.log(`Message Sent ${info.response}`);
        });
      });

      return inviteLink;
    } catch (error) {
      throw new Error(error.message);
    }
  },

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
   * @param {string} id
   * @returns {Promise <IUserInvite >}
   * @memberof InvitationService
   */
  async findFromOrganization(id: string): Promise<Array<IUserInvite>> {
    console.log(id);
    try {
      return await UserInviteModel.find({
        organization: Types.ObjectId(id),
        // status: undefined
      }).populate("organization");
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * @param {string} id
   * @returns {Promise <IUserInvite >}
   * @memberof InvitationService
   */
  async deleteInvite(id: string): Promise<IUserInvite> {
    try {
      return await UserInviteModel.findByIdAndDelete({
        _id: Types.ObjectId(id),
      });
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

  /**
   * @param {string} id
   * @returns {Promise <any>}
   * @memberof UserService
   */
  async findOneAndUpdateLink(
    inviteId: string,
    link: string
  ): Promise<IUserInvite> {
    try {
      const filter: any = {
        _id: inviteId,
      };
      const update: any = {
        link,
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
