import { Router } from 'express';
import { UserComponent } from '../components';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.get('/', UserComponent.findAll);
router.get('/:id', UserComponent.findOne);
router.post('/', UserComponent.create);
router.delete('/:id', UserComponent.remove);
router.put('/', UserComponent.update);

/**
 * @export {express.Router}
 */
export default router;
