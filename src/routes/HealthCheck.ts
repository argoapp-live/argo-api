import { Router, NextFunction, Request, Response } from "express";
import axios from 'axios';
import config from '../config/env';
const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send();
});

router.get('/paymentAlive', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.get(`${config.paymentApi.HOST_ADDRESS}/status`);
        res.status(200).json(response.data);
    } catch(error) {
        res.status(500).json({ msg: error.message });
    }
});

export default router;