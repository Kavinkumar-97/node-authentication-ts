import { Router } from 'express';
import passport from 'passport';

import {
  signin,
  signup,
  signout,
  createSession,
  createUser,
  changePassword,
} from '@controllers/user';
import checkAuthentication from '@middlewares/check-authentication';

const router: Router = Router();

router.get('/signin', signin);
router.get('/signup', signup);
router.get('/signout', checkAuthentication, signout);

router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
  }),
  createSession,
);
router.post('/signup', createUser);
router.post('/change-password', changePassword);

export default router;
