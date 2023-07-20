import {RequestHandler} from "express";

const setAuthenticatedUser: RequestHandler = (req, res, next) => {
  if(req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  
  return next()
}

export default setAuthenticatedUser;