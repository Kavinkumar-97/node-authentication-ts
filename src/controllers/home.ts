import { RequestHandler } from 'express';

export const home: RequestHandler = (req, res) => {
  return res.render('home');
};
