
import { Router } from 'express';
import { ConfigurationComponent } from '../components';

const router: Router = Router();

router.post('/', ConfigurationComponent.create);
router.get('/', ConfigurationComponent.findOne);
router.get('/:id', ConfigurationComponent.findById);

export default router