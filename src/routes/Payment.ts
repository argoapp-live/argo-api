
import { Router } from 'express';

import { PaymentComponent } from '../components';

const router: Router = Router();

router.post('/payments', PaymentComponent.insertPayment);

export default router;