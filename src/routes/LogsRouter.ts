import { Router } from "express";
import { LogsComponent } from "../components";

const router: Router = Router();

router.post("/", LogsComponent.newDeploy);

router.get("/:id", LogsComponent.FindDeploymentById);

export default router;
