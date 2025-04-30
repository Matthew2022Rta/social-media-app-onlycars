import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.mjs';

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user || user.password !== password) {
        return done(null, false); // login failed
      }
      return done(null, user); // login success
    } catch (err) {
      return done(err);
    }
  }
));

// Store user ID in session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Restore full user from DB each request
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});