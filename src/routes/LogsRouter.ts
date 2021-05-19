import { Router } from "express";
import { LogsComponent } from "../components";

const router: Router = Router();

router.post("/", LogsComponent.deploy);

router.get("/:id", LogsComponent.findDeploymentById);

export default router;
