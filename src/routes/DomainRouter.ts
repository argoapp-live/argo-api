import { Router } from "express";
import { Types } from "mongoose";
import GithubAppService from "../components/GitHubApp/service";
import RepositoryService from "../components/Repository/service";
import JWTTokenService from "../components/Session/service";

const router: Router = Router();

router.post('/', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
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
    catch (error) {
        res.json({
            message: error.message,
            success: false
        })
    }


});

router.post('/verify', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
            let result = await RepositoryService.VerifyDomain(req.body.repositoryId, req.body.domain);
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
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }


});

router.post('/subdomain/verify', async (req: any, res: any) => {
    try {
        const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
        const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
        let id = Types.ObjectId(deserializedToken.session_id);
        const getUserToken = await GithubAppService.findByUserId(id);
        if (getUserToken) {
            let result = await RepositoryService.VerifySubDomain(req.body.repositoryId, req.body.domain);
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
            await RepositoryService.UpdateDomain(req.body.domainId, req.body.domain, req.body.transactionId);
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
            await RepositoryService.UpdateSubDomain(req.body.domainId, req.body.domain, req.body.transactionId);
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


/**
 * @export {express.Router}
 */
export default router;