import { Router } from 'express';

import { signin, signup, signout } from '@controllers/user';

const router: Router = Router();

router.get('/signin', signin);
router.get('/signup', signup);
router.get('/signout', signout);

export default router;
