import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '@models/user';

export const config = (): passport.PassportStatic => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8000/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile.emails) {
            return done(null, false);
          }

          const email = profile.emails[0].value;
          console.log(email);
          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              password: profile.id,
            });

            if (!user) {
              return done(null, false);
            }
          }

          return done(null, user);
        } catch (e) {
          return done('', false);
        }
      },
    ),
  );

  return passport;
};

export default passport;
