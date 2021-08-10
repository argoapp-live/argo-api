import { Router } from "express";
import { SubscriptionComponent } from '../components';

const router: Router = Router();

router.post('/cancelSubscription',SubscriptionComponent.cancelSubscription);

router.post('/subscribe',SubscriptionComponent.subscribe);

router.post('/changeSubscriptionPackage',SubscriptionComponent.changeSubscriptionPackage);

router.post('/confirmSubscriptionPayment',SubscriptionComponent.activateOrRejectSubscription);