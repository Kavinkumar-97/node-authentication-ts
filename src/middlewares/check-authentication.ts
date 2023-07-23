import { RequestHandler } from 'express';
import * as console from 'console';

const checkAuthentication: RequestHandler = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/signin');
  }
};

export default checkAuthentication;
