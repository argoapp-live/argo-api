import { Router } from "express";
import { DomainComponent } from '../components';

const router: Router = Router();

router.post('/', DomainComponent.create);
router.get('/', DomainComponent.findOne);
router.get('/:id', DomainComponent.findById);

export default router;

// router.post('/', async (req: any, res: any) => {
//     try {
//         const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
//         const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
//         let id = Types.ObjectId(deserializedToken.session_id);
//         const getUserToken = await GithubAppService.findByUserId(id);
//         if (getUserToken) {
//             let result = await DomainService.insert(req.body);
//             if (!result) {
//                 res.status(200).json({
//                     success: false
//                 });
//             } else {
//                 res.status(200).json({
//                     success: true
//                 });
//             }
//         }
//     }
//     catch (error) {
//         res.json({
//             message: error.message,
//             success: false
//         })
//     }


// });

// router.post('/verify', async (req: any, res: any) => {
//     try {
//         const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
//         const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
//         let id = Types.ObjectId(deserializedToken.session_id);
//         const getUserToken = await GithubAppService.findByUserId(id);
//         if (getUserToken) {
//             let result = await DomainService.verify();
//             if (!result) {
//                 res.status(200).json({
//                     success: false
//                 });
//             } else {
//                 res.status(200).json({
//                     success: true
//                 });
//             }
//         }
//     }
//     catch (error) {
//         res.json({
//             message: error.message,
//             success: false
//         })
//     }


// });


// router.put('/', async (req: any, res: any) => {
//     try {
//         const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
//         const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
//         let id = Types.ObjectId(deserializedToken.session_id);
//         const getUserToken = await GithubAppService.findByUserId(id);
//         if (getUserToken) {
//             await DomainService.update();
//         }

//         res.status(200).json({
//             success: false
//         });
//     }
//     catch (error) {
//         res.json({
//             message: error.message,
//             success: false
//         })
//     }
// });


// router.delete('/', async (req: any, res: any) => {
//     try {
//         const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(req);
//         const deserializedToken: any = await JWTTokenService.VerifyToken(argoDecodedHeaderToken);
//         let id = Types.ObjectId(deserializedToken.session_id);
//         const getUserToken = await GithubAppService.findByUserId(id);
//         if (getUserToken) {
//             await DomainService.remove();
//         }
//         res.status(200).json({
//             success: true
//         });
//     }
//     catch (error) {
//         res.json({ message: error.message, success: false })
//     }

// });


// /**
//  * @export {express.Router}
//  */
// export default router;