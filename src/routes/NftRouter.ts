import { Router } from "express";
import { NftComponent } from "../components";

const router: Router = Router();

router.post("/metadata", NftComponent.getMetadataUrl);


export default router;
