import { RequestHandler } from 'express';

const checkAuthentication: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/signin');
  }
};

export default checkAuthentication;
