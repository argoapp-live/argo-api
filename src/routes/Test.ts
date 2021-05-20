import { Router } from 'express';
import { Request, Response } from 'express';

const router: Router = Router();

router.get('/test', (req: Request, res: Response) => {
    console.log('im finaly in');
    res.status(200).json({ msg: 'bravo' });
});

//router.get('/github/getcommits', RepositoryComponent.GetCommits);

export default router;
