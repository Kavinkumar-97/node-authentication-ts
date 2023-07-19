import { Router } from 'express';
import userRouter from '@routes/user';

const router: Router = Router();

router.use(userRouter);

export default router;
