import passport from 'passport';
import { Strategy } from 'passport-local';

import User, { IUser } from '@models/user';

passport.use(
  new Strategy({ usernameField: 'email' }, async function (
    email,
    password,
    done,
  ) {
    try {
      const user = await User.findOne({ email });

      if (!user || !(await user.checkPassword(password))) {
        return done(null, false);
      }

      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }),
);

passport.serializeUser((user: Partial<IUser>, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = User.findById(id);
    done(null, user || false);
  } catch (e) {
    done(e);
  }
});

export default passport;
