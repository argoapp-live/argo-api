import { Router } from 'express';
import * as passport from 'passport';
import AuthService from '../components/Auth/service';
import { IArgoSessionDto } from '../components/Session/interface';
import JWTTokenService from '../components/Session/service';
import { IUserModel } from '../components/User/model';
import config from '../config/env/index';
import GithubAppService from '../components/GitHubApp/service';
import { Types } from 'mongoose';
// const { createAppAuth } = require('@octokit/auth-app');
// import { createAppAuth } from '@octokit/auth-app';
// const axios = require('axios').default;
const fs = require('fs');
const path = require('path');

// const fullPath = path.join(__dirname, `../templates/user-org-invite/${config.githubApp.PEM_FILE_NAME}`);
// const readAsAsync = fs.readFileSync(fullPath, 'utf8');
/**
 * @constant {express.Router}
 */
const router: Router = Router();


router.get('/github', passport.authenticate('github'));

router.get(
    '/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${config.argoReact.BASE_ADDRESS}/signup`,
    }),
    async (req, res) => {
        const userProfileModel: IUserModel = await AuthService.findProfileOrCreate({
            providerProfile: {
                ...req.user.profile._json,
                username: req.user.profile.username,
                email: req.user.profile.emails?.filter((email: any) => email.primary || email.primary === undefined)[0].value
            },
            provider: { name: req.user.profile.provider },
            argoProfile: {
                username: req.user.profile.username,
                avatar: req.user.profile._json.avatar_url,
                email: req.user.profile.emails?.filter((email: any) => email.primary || email.primary === undefined)[0].value,
                name: req.user.profile.displayName
            },
        });

        const argoSessionDto: IArgoSessionDto = {
            session_id: userProfileModel.id,
            access_token: req.user.accessToken,
            is_active: true,
        };

        const dtos: IArgoSessionDto = await JWTTokenService.findSessionOrCreate(
            argoSessionDto
        );
        const token: string = await JWTTokenService.generateToken(dtos);

        res.redirect(`${config.argoReact.BASE_ADDRESS}/callback/github?token=${token}`);
    }
);

router.delete('/logout', async (req, res) => {
    const token: any = await JWTTokenService.DecodeToken(req);
    const verifiedToken: any = await JWTTokenService.VerifyToken(token);

    await JWTTokenService.FindAndRemove(verifiedToken.session_id);
    await req.logOut();
    req.session = null;
    res.status(200).json({ success: true });
});

router.get(
    '/gitlab',
    passport.authenticate('gitlab', {
        scope: ['api'],
    })
);

router.get(
    '/gitlab/callback',
    passport.authenticate('gitlab', {
        failureRedirect: `${config.argoReact.BASE_ADDRESS}/signup`,
    }),
    async (req, res) => {
        const userProfileModel: IUserModel = await AuthService.findProfileOrCreate({
            providerProfile: {
                ...req.user.profile._json
            },
            provider: { name: req.user.profile.provider },
            argoProfile: {
                username: req.user.profile._json.username,
                avatar: req.user.profile._json.avatar_url,
                email: req.user.profile._json.email,
                name: req.user.profile._json.name
            },
        });

        const argoSessionDto: IArgoSessionDto = {
            session_id: userProfileModel.id,
            access_token: req.user.accessToken,
            is_active: true,
        };

        const dtos: IArgoSessionDto = await JWTTokenService.findSessionOrCreate(
            argoSessionDto
        );
        const token: string = await JWTTokenService.generateToken(dtos);

        res.redirect(`${config.argoReact.BASE_ADDRESS}/callback/github?token=${token}`);
    }
);

router.get('/github/app', async (req, res) => {
    const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
    const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
    let id = Types.ObjectId(deserializedToken.session_id);
    const getUserToken = await GithubAppService.findByUserId(id);
    // const instanceAxios = axios.create({
    //     baseURL: 'https://api.github.com/user/installations',
    //     timeout: 2000,
    //     headers: {
    //         authorization: `bearer ${getUserToken.token}`,
    //         Accept: 'application/vnd.github.v3+json'
    //     }
    // });
    // const userInfo = await instanceAxios.get();

    res.status(200).json({
        success: true,
        // total_count: userInfo.data.total_count,
        // installations: userInfo.data.installations
    });

});

router.get('/github/app/auth/:id', async (req, res) => {
    const getUserToken = await GithubAppService.findByUserId(Types.ObjectId(`${req.params.id}`));

    if (getUserToken) {
        res.redirect(`${config.argoReact.BASE_ADDRESS}/github/callback/app`);
    }
    else {
        res.redirect(config.githubApp.GITHUB_APP_CALLBACK_URL);
    }
});

router.get('/github/app/new', async (req, res) => {
    res.redirect(config.githubApp.GITHUB_APP_CALLBACK_URL);
});


router.get('/github/app/callback', async (req, res) => {
    // const auth = await createAppAuth({
    //     id: config.githubApp.GIT_HUB_APP_ID,
    //     privateKey: readAsAsync,
    //     installationId: req.query.installation_id,
    //     clientId: config.githubApp.GITHUB_APP_CLIENT_ID,
    //     clientSecret: config.githubApp.GITHUB_APP_CLIENT_SECRET,
    // });
    // const authToken = await auth({ type: 'oauth', code: req.query.code });
    // const instanceAxios = axios.create({
    //     baseURL: 'https://api.github.com/user',
    //     timeout: 1000,
    //     headers: { authorization: `bearer ${authToken.token}` }
    // });
    // const userInfo = await instanceAxios.get();

    // await GithubAppService.findAndCreate(userInfo.data.id, authToken.token, +req.query.installation_id);
    res.redirect(`${config.argoReact.BASE_ADDRESS}/github/callback/app`);
});

router.post('/github/events', async (req, res) => {
    if (req.body.action === 'deleted') {
        await GithubAppService.remove(req.body.installation.id);
    }
    res.status(200).json({
        success: true
    });
});

/**
 * @export {express.Router}
 */
export default router;
