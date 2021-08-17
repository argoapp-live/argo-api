import { Router } from "express";
import { DomainComponent } from "../components";

const router: Router = Router();

router.post("/", DomainComponent.create);
router.post("/verify", DomainComponent.verify);
router.put("/:id", DomainComponent.update);
router.delete("/:id", DomainComponent.remove);

export default router;
