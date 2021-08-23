import * as path from "path";
import { IEmailData } from "./interface";
// tslint:disable-next-line: typedef
const EmailTemplate = require("email-templates").EmailTemplate;
// tslint:disable-next-line: typedef
const templatesDir = path.resolve(__dirname, "../../templates");

// constants - paths
const invitePath = "user-org-invite"
const welcomePath = "first-mail"
const firstDeploymentPath = "first-deployment"
const tenthDeploymentPath = "tenth-deployment"
const hundredthDeploymentPath = "hundredth-deployment"

export const emailData: IEmailData = {
    invite: {
      template : new EmailTemplate(
        path.join(templatesDir, invitePath)
      ),
      subject : "Join Argo org"
    },
    welcome: {
      template : new EmailTemplate(
        path.join(templatesDir, welcomePath)
      ),
      subject : "Welcome to ArGo"
    },
    firstDeployment: {
      template : new EmailTemplate(
        path.join(templatesDir, firstDeploymentPath)
      ),
      subject : "Congrats of first deployment"
    },
    tenthDeployment: {
      template : new EmailTemplate(
        path.join(templatesDir, tenthDeploymentPath)
      ),
      subject : "Congrats of tenth deployment"
    },
    hundredthDeployment: {
      template : new EmailTemplate(
        path.join(templatesDir, hundredthDeploymentPath)
      ),
      subject : "Congrats of hundredth deployment"
    }
}

