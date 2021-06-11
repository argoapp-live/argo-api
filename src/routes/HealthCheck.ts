import { Router, NextFunction, Request, Response } from "express";
const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send();
});

export default router;