import { RequestHandler, Request, Response } from 'express';
import * as crypto from 'crypto';

import User, { IUser } from '@models/user';
import { checkPassword } from '@config/bcrypt';
import PasswordToken from '@models/password-token';
import { sendForgotPasswordEmail } from '@mailers/forgot-password-mailer';
import * as console from 'console';

export const signin: RequestHandler = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return res.render('auth/signin');
};

export const createSession: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  req.flash('success', 'Signed in successfully');
  res.redirect('/');
};

export const signup: RequestHandler = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return res.render('auth/signup');
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { password, confirmPassword } = req.body;
    const user: IUser = req.body;

    console.log(password, confirmPassword);
    if (password !== confirmPassword) {
      req.flash('error', "Password and confirm password doen't match");
      return res.status(406).redirect('back');
    }

    const newUser = await User.create(user);

    if (!newUser) {
      req.flash('error', 'Unable to create user');
      return res.redirect('back');
    }

    return res.redirect('/');
  } catch (e) {
    return res.json({ error: 'Something Went Wrong' });
  }
};

export const signout: RequestHandler = (req: Request, res: Response) => {
  req.logOut((err) => {
    if (err) {
      return res.send(err);
    }
    req.flash('success', 'Logged out successfully');
    return res.redirect('/signin');
  });
};

export const changePassword: RequestHandler = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      req.flash('error', "Password and confirm password doen't match");
      return res.status(406).redirect('/');
    }

    const reqUser = req.user as IUser;

    if (await checkPassword(password, reqUser.password)) {
      req.flash('error', "Old password can't be your new password");
      return res.status(406).redirect('/');
    }

    const user = await User.findById(reqUser.id);
    if (user) {
      user.password = password;
      await user?.save();
    } else {
      req.flash('error', 'Unable to update');
      return res.status(406).redirect('/');
    }

    req.flash('success', 'Password changed successfully');
    return res.redirect('/');
  } catch (e) {
    console.log(e);
    return res.json({ error: 'Something Went Wrong' });
  }
};

export const renderResetPassword: RequestHandler = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  const token = req.query.token;
  const passwordToken = await PasswordToken.findOne({ token });

  if (!passwordToken || !passwordToken.isValid) {
    return res.send('<h1>Invalid URL</h1>');
  }

  return res.render('auth/reset-password', { token });
};

export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password !== confirmPassword) {
      req.flash('error', "Password and confirm password doen't match");
      return res.status(406).redirect('/reset-password');
    }

    const passwordToken = await PasswordToken.findOne({ token }).populate(
      'user',
    );

    if (!passwordToken || !passwordToken.isValid) {
      return res.send('<h1>Invalid URL</h1>');
    }

    const reqUser = passwordToken.user as IUser;

    if (await checkPassword(password, reqUser.password)) {
      req.flash('error', "Old password can't be your new password");
      return res.status(406).redirect('/reset-password');
    }

    const user = await User.findById(reqUser.id);
    if (user) {
      user.password = password;
      await user?.save();
    } else {
      req.flash('error', 'Unable to update');
      return res.status(406).redirect('/reset-password');
    }

    passwordToken.isValid = false;
    passwordToken.save();

    req.flash('success', 'Password changed successfully');
    return res.redirect('/signin');
  } catch (e) {
    console.log(e);
    return res.json({ error: 'Something Went Wrong' });
  }
};

export const forgotPassword: RequestHandler = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return res.render('auth/forgot-password');
};

export const createForgotPasswordToken: RequestHandler = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    req.flash('error', 'Email address is required');
    return res.redirect('/forgot-password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    req.flash('error', 'No associated account found for this email');
    return res.redirect('/forgot-password');
  }

  const token = crypto.randomBytes(16).toString('hex');

  const passwordToken = PasswordToken.create({ token, user });

  if (!passwordToken) {
    req.flash(
      'error',
      'Unable to send reset password email. Please try again after some time.',
    );
    return res.redirect('/forgot-password');
  }

  sendForgotPasswordEmail(user, token).then((_) =>
    console.log('Mail send successfully'),
  );

  req.flash('success', 'Password reset mail sent successfully');
  return res.redirect('/signin');
};
