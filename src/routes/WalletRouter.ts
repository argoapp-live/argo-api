
import { Router } from 'express';

import { WalletComponent } from '../components';

const router: Router = Router();

router.post('/', WalletComponent.createWallet);
router.delete('/', WalletComponent.removeWallet);

// router.get('/', WalletComponent.getWallet);

export default router;