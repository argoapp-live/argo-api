import { Router } from 'express';
import { WebHookComponent } from '../components';

const router: Router = Router();

router.post('/create', WebHookComponent.testWebhook);
router.post('/trigger/:id', WebHookComponent.triggerWebHook);
router.post('/trigger2/', WebHookComponent.triggerWebHook2);

export default router;
