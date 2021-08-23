import { IEmailAttributes, IEmailData, IEmailService } from "./interface";
import * as nodemailer from "nodemailer";

import config from "../../config/env/index";
import { emailData } from "./helper";

const EmailService: IEmailService = {
  async sendMail(
    to: string,
    locals: any,
    emailAttributes: IEmailAttributes
  ): Promise<boolean> {
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

      emailAttributes.template.render(locals, (err: any, results: any) => {
        if (err) {
          return console.error(err);
        }
        const options: any = {
          from: `"Argo Team" ${config.smtp.USERNAME}`, // sender address
          // tslint:disable-next-line: object-shorthand-properties-first
          to, // list of receivers
          subject: emailAttributes.subject, // Subject line
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

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  firstMail: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  firstDeploymentMail: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  tenthDeploymentMail: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  hunderdthDeploymentMail: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  inviteMail: async function (
    to: string,
    inviteId: string,
    orgName: string,
    invitingUser: string): Promise<boolean> {
    const locals: any = {
      orgName,
      invitingUser,
      inviteLink:
        config.frontendApp.HOST_ADDRESS +
        `/#/invite/callback?ref=${encodeURIComponent(
          inviteId
        )}&orgName=${encodeURIComponent(orgName)}`,
    };

    const emailStatus = await EmailService.sendMail(to, locals, emailData.invite)
    return emailStatus
  }
}
export default EmailService;