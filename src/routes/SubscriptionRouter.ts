import { Router } from "express";
import { SubscriptionComponent } from '../components';

const router: Router = Router();

router.post('/cancelSubscription',SubscriptionComponent.cancelSubscription);

router.post('/subscribe',SubscriptionComponent.subscribe);

router.post('/changeSubscriptionPackage',SubscriptionComponent.changeSubscriptionPackage);

router.post('/activateOrRejectSubscription',SubscriptionComponent.activateOrRejectSubscription);

router.post('/deploy',SubscriptionComponent.deploy);

export default router;
