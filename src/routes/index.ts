import { Router } from 'express';
import userRouter from '@routes/user';
import { home } from '@controllers/home';
import checkAuthentication from '@middlewares/check-authentication';

const router: Router = Router();

router.use(userRouter);
router.get('/', checkAuthentication, home);

export default router;
