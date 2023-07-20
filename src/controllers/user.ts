import { RequestHandler, Request, Response } from 'express';

import User, { IUser } from '@models/user';

export const signin: RequestHandler = (req: Request, res: Response) => {
  return res.render('auth/signin');
};

export const createSession: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const user: IUser = req.body;
  } catch (e) {
    return res.json({ error: 'Something Went Wrong' });
  }
};

export const signup: RequestHandler = (req: Request, res: Response) => {
  return res.render('auth/signup');
};

export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const user: IUser = req.body;
    const newUser = await User.create(user);
    console.log(newUser);
    res.redirect('/');
  } catch (e) {
    return res.json({ error: 'Something Went Wrong' });
  }
};

export const signout: RequestHandler = (req: Request, res: Response) => {};
