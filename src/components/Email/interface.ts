// tslint:disable-next-line: typedef
const EmailTemplate = require("email-templates").EmailTemplate;


/**
 * @export
 * @interface IEmailService
 */
export interface IEmailService {
    sendMail(
        to: string,
        locals: any,
        emailAttributes: IEmailAttributes): Promise<boolean>;
    firstMail(): Promise<any>;
    firstDeploymentMail(): Promise<any>;
    tenthDeploymentMail(): Promise<any>;
    hunderdthDeploymentMail(): Promise<any>;
    inviteMail(to: string,
        inviteId: string,
        orgName: string,
        invitingUser: string): Promise<any>;
}

export interface IEmailData {
    invite: IEmailAttributes,
    welcome: IEmailAttributes,
    firstDeployment: IEmailAttributes,
    tenthDeployment: IEmailAttributes,
    hundredthDeployment: IEmailAttributes,
}

export interface IEmailAttributes {
    template: typeof EmailTemplate;
    subject: string;
}
