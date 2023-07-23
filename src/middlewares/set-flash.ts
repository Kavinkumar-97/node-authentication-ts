import { RequestHandler } from 'express';

const setFlash: RequestHandler = (req, res, next) => {
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
  };

  next();
};

export default setFlash;
