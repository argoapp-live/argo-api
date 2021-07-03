import { Router } from 'express';

import { InvitationComponent } from '../components';

const router: Router = Router();

router.post('/', InvitationComponent.sendInvite);
router.post('/update', InvitationComponent.updateInvite);

export default router;
