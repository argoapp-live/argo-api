import { Router } from "express";
import { SubscriptionPackageComponent } from '../components';

const router: Router = Router();

router.get('/',SubscriptionPackageComponent.findAll);

router.get('/getDefault',SubscriptionPackageComponent.findDefaultPackages)

router.post('/insert',SubscriptionPackageComponent.insert);

router.post('/calculatePrice',SubscriptionPackageComponent.calculatePrice);


export default router;