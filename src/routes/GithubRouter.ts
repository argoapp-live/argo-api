import { Router } from "express";

import JWTTokenService from "../components/Session/service";
import config from "../config/env/index";
import GithubAppService from "../components/GitHubApp/service";
import { Types } from "mongoose";
const { createAppAuth } = require("@octokit/auth-app");
// import { createAppAuth } from '@octokit/auth-app';
const axios = require("axios").default;
const fs = require("fs");
const path = require("path");

let privateKey: string;

if (config.githubApp.PEM_CONTENT_BASE64) {
  const base64Encoded: string = config.githubApp.PEM_CONTENT_BASE64;
  const buff: Buffer = Buffer.from(base64Encoded, "base64");

  privateKey = buff.toString("ascii");
} else {
  const fullPath: string = path.join(
    __dirname,
    `../templates/user-org-invite/${config.githubApp.PEM_FILE_NAME}`
  );

  privateKey = fs.readFileSync(fullPath, "utf8");
}

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.get("/app", async (req, res) => {
  const argoDecodedHeaderToken: any = await JWTTokenService.decodeToken(req);
  const deserializedToken: any = await JWTTokenService.verifyToken(
    argoDecodedHeaderToken
  );
  let id = Types.ObjectId(deserializedToken.sessionId);
  const getUserToken = await GithubAppService.findByUserId(id);
  const instanceAxios = axios.create({
    baseURL: "https://api.github.com/user/installations",
    timeout: 2000,
    headers: {
      authorization: `bearer ${getUserToken.token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  const userInfo = await instanceAxios.get();

  res.status(200).json({
    success: true,
    total_count: userInfo.data.total_count,
    installations: userInfo.data.installations,
  });
});

router.get("/app/auth/:id", async (req, res) => {
  const getUserToken = await GithubAppService.findByUserId(
    Types.ObjectId(`${req.params.id}`)
  );

  if (getUserToken) {
    res.redirect(`${config.frontendApp.HOST_ADDRESS}/#/github/callback/app`);
  } else {
    res.redirect(config.githubApp.CALLBACK_URL);
  }
});

router.get("/app/new", async (req, res) => {
  res.redirect(config.githubApp.CALLBACK_URL);
});

router.get("/app/callback", async (req, res) => {
  try {
    const auth = await createAppAuth({
      appId: config.githubApp.APP_ID,
      privateKey,
      installationId: req.query.installation_id,
      clientId: config.githubApp.CLIENT_ID,
      clientSecret: config.githubApp.CLIENT_SECRET,
    });
    const authToken = await auth({ type: "oauth-user", code: req.query.code });

    const instanceAxios = axios.create({
      baseURL: "https://api.github.com/user",
      timeout: 1000,
      headers: { authorization: `bearer ${authToken.token}` },
    });
    const userInfo = await instanceAxios.get();

    await GithubAppService.findAndCreate(
      userInfo.data.id,
      authToken.token,
      +req.query.installation_id
    );
    res.redirect(`${config.frontendApp.HOST_ADDRESS}/#/github/callback/app`);
  } catch (error) {
    console.log("NEW ERROR", error.message);
  }
});

/**
 * @export {express.Router}
 */
export default router;
