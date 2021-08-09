import { Router } from 'express';
import { ProjectComponent } from '../components';


const router: Router = Router();

router.post('/', ProjectComponent.create);

router.get('/github/repo', ProjectComponent.GetUserRepos);

router.get('/:id', ProjectComponent.findOne);
router.put('/env/:id', ProjectComponent.updateEnv);
router.put('/:id', ProjectComponent.findOneAndUpdate);

router.put('/changeStateToArchived/:id', ProjectComponent.changeStateToArchived);
router.put('/changeStateToMaintained/:id', ProjectComponent.changeStateToMaintained);

router.get('/installations/:installationId', ProjectComponent.getInstallationRepos);

router.get('/installations/repo/branch', ProjectComponent.getBranches);

export default router;
