import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GithubStrategy } from 'passport-github2';
import { User } from '../models/user.model.js';
import { ENV } from './env.config.js';
import { SERVER } from '../constants.js';

// Configure Passport strategies
const configurePassport = () => {
  // Serialize
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // * Google Strategy
  passport.use(new GoogleStrategy(
  {
    clientID: ENV.GOOGLE_CLIENT_ID,
    clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    callbackURL: `${SERVER.CLIENT_URI + ENV.GOOGLE_CALLBACK_URI}`,
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // * Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });

      // Check if email already exists
      if (user) {
        // * Existed User → link Google to their account
        if (!user.provider.includes('google')) {
          user.provider.push('google');
          user.googleId = profile.id;
          await user.save({ validateBeforeSave: false });
        }
      } else {
        // * New User → create account with Google
        user = await User.create({
          email: profile.emails[0].value,
          username: profile.displayName.toLowerCase().replace(/\s+/g, '_'),
          googleId: profile.id,
          provider: ['google'],
          isEmailVerified: true, // * Email is verified by Google
          avatar: profile.photos[0]?.value
        });
        // * Save with validation to ensure our model changes work
        await user.save();        
      }
      
      return done(null, user);
    } catch (error) {
      // Duplicate email error
      if (error.code === 11000) {
        console.error("Google Auth Error:", error);
        return done(null, false, { message: "Email Already Registered!" });
      } else {
        return done(error);
      }
    }
  }));

  // * Facebook Strategy
  passport.use(new FacebookStrategy(
  {
    clientID: ENV.FACEBOOK_APP_ID,
    clientSecret: ENV.FACEBOOK_APP_SECRET,
    callbackURL: `${SERVER.CLIENT_URI + ENV.FACEBOOK_CALLBACK_URI}`,
    profileFields: ['id', 'emails', 'name', 'picture.type(large)']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // * Similar implementation as Google strategy
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save({ validateBeforeSave: false });
        }
      } else {
        user = await User.create({
          email: profile.emails[0].value,
          username: `${profile.name.givenName} ${profile.name.familyName}`,
          facebookId: profile.id,
          isEmailVerified: true,
          avatar: profile.photos[0]?.value
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // * GitHub Strategy
  passport.use(new GithubStrategy(
  {
    clientID: ENV.GITHUB_CLIENT_ID,
    clientSecret: ENV.GITHUB_CLIENT_SECRET,
    callbackURL: `${SERVER.CLIENT_URI + ENV.GITHUB_CALLBACK_URI}`,
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });
      
      if (user) {
        if (!user.githubId) {
          user.githubId = profile.id;
          await user.save({ validateBeforeSave: false });
        }
      } else {
        user = await User.create({
          email,
          username: profile.username,
          githubId: profile.id,
          isEmailVerified: true,
          avatar: profile.photos[0]?.value
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
};

export { configurePassport }