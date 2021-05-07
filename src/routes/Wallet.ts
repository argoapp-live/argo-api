
import { Router } from 'express';

import { WalletComponent } from '../components';

const router: Router = Router();

router.post('/', WalletComponent.createWallet);

export default router;