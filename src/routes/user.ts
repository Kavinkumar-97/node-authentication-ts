import { Router } from 'express';
import passport from 'passport';

import {
  signin,
  signup,
  signout,
  createSession,
  createUser,
  changePassword,
  forgotPassword,
  createForgotPasswordToken,
  renderResetPassword,
  resetPassword,
} from '@controllers/user';
import checkAuthentication from '@middlewares/check-authentication';

const router: Router = Router();

router.get('/signin', signin);
router.get('/signup', signup);
router.get('/signout', checkAuthentication, signout);
router.get('/forgot-password', forgotPassword);
router.get('/reset-password', renderResetPassword);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/signin',
    successRedirect: '/',
  }),
);

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
  }),
  createSession,
);
router.post('/signup', createUser);
router.post('/change-password', changePassword);
router.post('/forgot-password', createForgotPasswordToken);
router.post('/reset-password', resetPassword);

export default router;
