const axios = require('axios');
import { pseudoRandomBytes } from "crypto";
import { Router } from "express";
import { Types } from "mongoose";
import GithubAppService from "../components/GitHubApp/service";
import RepositoryService from "../components/Repository/service";
import JWTTokenService from "../components/Session/service";

const router: Router = Router();

var request = require('request');

router.post('/', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
            var sendRequest = await sendAddRequest(req);

            if (sendRequest) {
                let result = await RepositoryService.InsertDomain(req.body.repositoryId, req.body.domain, req.body.transactionId, req.body.isLatest);
                if (!result) {
                    res.status(200).json({
                        success: false
                    });
                } else {
                    res.status(200).json({
                        success: true
                    });
                }
            }
        }
    }
    catch (error) {
        res.json({
            message: error.message,
            success: false
        })
    }


});

router.post('/subdomain', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
            var sendRequest = await sendAddRequest(req);
            if (sendRequest) {
                let result = await RepositoryService.InsertSubDomain(req.body.repositoryId, req.body.domain, req.body.transactionId, req.body.isLatest);
                if (!result) {
                    res.status(200).json({
                        success: false
                    });
                }
                else {
                    res.status(200).json({
                        success: true
                    });
                }
            }
        }
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }


});

router.put('/', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
            let sendRequest = await sendAddRequest(req);
            if (sendRequest) {
                await RepositoryService.UpdateDomain(req.body.domainId, req.body.domain, req.body.transactionId);
            }
            else {
                res.status(200).json({
                    success: true
                });
            }
        }

        res.status(200).json({
            success: false
        });
    }
    catch (error) {
        res.json({
            message: error.message,
            success: false
        })
    }
});
router.put('/subdomain', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
            let sendRequest = await sendAddRequest(req);
            if (sendRequest) {
                await RepositoryService.UpdateSubDomain(req.body.domainId, req.body.domain, req.body.transactionId);
            } else {
                res.status(200).json({
                    success: true
                });
            }
        }
        res.status(200).json({
            success: false
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }

});

router.delete('/subdomain', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
            await RepositoryService.RemoveSubDomain(req.body.domainId, req.body.repositoryId);
        }
        res.status(200).json({
            success: true
        });
    }
    catch (error) {
        res.json({ message: error.message, success: false })
    }

});

router.delete('/', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
            await RepositoryService.RemoveDomain(req.body.domainId, req.body.repositoryId);
        }
        res.status(200).json({
            success: true
        });
    }
    catch (error) {
        res.json({ message: error.message, success: false })
    }

});

const sendAddRequest = async (req: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://dns.perma.online/v0/add_domain',
            'headers': {
                'Content-Type': 'text/plain'
            },
            body: req.body.domain
        };
        request(options, function (error: any, response: any) {
            if (error) reject(error);
            resolve(response);
        });
    });

}

/**
 * @export {express.Router}
 */
export default router;