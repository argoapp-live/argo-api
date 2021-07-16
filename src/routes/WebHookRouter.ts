import { Router } from 'express';
import { WebHookComponent } from '../components';

const router: Router = Router();

router.post('/create', WebHookComponent.testWebhook);
router.post('/trigger/:id', WebHookComponent.triggerWebHook);

export default router;
