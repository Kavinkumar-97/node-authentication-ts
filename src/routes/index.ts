import { Router } from 'express';
import userRouter from '@routes/user';
import homeRouter from '@controllers/user';

const router: Router = Router();

router.use(userRouter);
router.get('/', home);

export default router;
