import { Router } from "express";
import { DeploymentComponent } from "../components";

const router: Router = Router();

router.post("/", DeploymentComponent.deployFromRequest);
router.post("/created", DeploymentComponent.deploymentFinished);
router.post("/payment", DeploymentComponent.paymentFinished);
router.get("/:id", DeploymentComponent.findDeploymentById);

router.post('/finished', DeploymentComponent.subscriptionDeploymentFinished);

export default router;
