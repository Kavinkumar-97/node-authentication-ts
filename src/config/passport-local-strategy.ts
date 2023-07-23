import passport from 'passport';
import { Strategy } from 'passport-local';

import User, { IUser } from '@models/user';

export const config = (): passport.PassportStatic => {
  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        try {
          const user = await User.findOne({ email });

          if (!user || !(await user.checkPassword(password))) {
            req.flash('error', 'Invalid Email or password');

            return done(null, false);
          }

          return done(null, user);
        } catch (e) {
          return done(e);
        }
      },
    ),
  );

  passport.serializeUser((user: Partial<IUser>, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user || false);
    } catch (e) {
      done(e);
    }
  });

  return passport;
};

export default passport;
