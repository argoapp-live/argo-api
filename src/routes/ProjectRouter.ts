import { Router } from 'express';
import { ProjectComponent } from '../components';

const router: Router = Router();

router.post('/', ProjectComponent.create);

router.get('/github/repo', ProjectComponent.getUserRepos);

router.get('/:id', ProjectComponent.findOne);
router.put('/:id', ProjectComponent.findOneAndUpdate);

router.get(
  '/installations/:installationId',
  ProjectComponent.getInstallationRepos
);

router.get('/installations/repo/branch', ProjectComponent.getBranches);

export default router;
