import { RequestHandler, Request, Response } from 'express';

import User, { IUser } from '@models/user';
import { checkPassword, hashPassword } from '@config/bcrypt';
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
      return res.status(406).redirect('/signup');
    }

    const newUser = await User.create(user);

    if (!newUser) {
      req.flash('error', 'Unable to create user');
      return res.redirect('/signup');
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
    return res.redirect('/');
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

    return res.redirect('/');
  } catch (e) {
    console.log(e);
    return res.json({ error: 'Something Went Wrong' });
  }
};
