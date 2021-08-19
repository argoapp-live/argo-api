import { Router } from "express";

import { InvitationComponent } from "../components";

const router: Router = Router();

router.post("/", InvitationComponent.sendInvite);
router.post("/update", InvitationComponent.updateInvite);
router.post("/list", InvitationComponent.getInvites);
router.delete("/delete", InvitationComponent.deleteInvite);


export default router;
