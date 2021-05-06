
import { Router } from 'express';

import { WalletComponent } from '../components';

const router: Router = Router();

router.post('/', WalletComponent.createWallet);
router.post('/approve', WalletComponent.approve);
router.post('/discharge', WalletComponent.discharge);

export default router;