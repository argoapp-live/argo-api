import { Router } from "express";
import { WebHookComponent } from "../components";

const router: Router = Router();

router.post("/connect", WebHookComponent.connect);
router.post("/create", WebHookComponent.createWebHook);
router.post("/trigger/:projectId", WebHookComponent.triggerWebHook);
router.put("/:id", WebHookComponent.update);
router.delete("/:id", WebHookComponent.remove);

export default router;
