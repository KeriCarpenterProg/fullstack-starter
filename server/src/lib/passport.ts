import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from './db';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/oauth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await db.user.findUnique({
          where: { googleId: profile.id },
        });

        if (user) {
          // User exists, return them
          return done(null, user);
        }

        // Check if user exists with this email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await db.user.findUnique({
            where: { email },
          });

          if (user) {
            // User exists with this email, link Google account
            user = await db.user.update({
              where: { id: user.id },
              data: { googleId: profile.id },
            });
            return done(null, user);
          }
        }

        // Create new user
        user = await db.user.create({
          data: {
            googleId: profile.id,
            email: email || '',
            name: profile.displayName,
            // No password needed for OAuth users
            password: null, 
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;