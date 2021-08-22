import { Router } from "express";
import { SharedParameterComponent } from '../components';

const router: Router = Router();

router.get('/',SharedParameterComponent.findAll);

router.post('/insert',SharedParameterComponent.insert);

router.get('/getParameter',SharedParameterComponent.getParameter);


export default router;