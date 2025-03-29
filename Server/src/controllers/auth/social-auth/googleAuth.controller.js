import passport from 'passport'
import { socialAuthCallback } from './socialAuth.controller.js';

// * Google Auth controller - initiates Google OAuth flow
const googleAuth = (req, res, next) => {
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })(req, res, next);
};

// * Google Auth Callback controller - handles the callback from Google
const googleAuthCallback = (req, res, next) => {
  console.log("Google callback hit with query:", req.query);
  
  passport.authenticate('google', { 
    failureRedirect: '/api/v1/auth/social/failure'
  }, (err, user, info) => {
    if (err) {
      console.error("Google auth callback error:", err);
      return res.redirect('/api/v1/auth/social/failure');
    }
    
    if (!user) {
      console.error("No user returned from Google auth");
      return res.redirect('/api/v1/auth/social/failure');
    }
    
    console.log("User authenticated successfully:", user.id);
    
    // Log in the user
    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.redirect('/api/v1/auth/social/failure');
      }
      
      // Call the socialAuthCallback to handle tokens and cookies
      return socialAuthCallback(req, res, next);
    });
  })(req, res, next);
};

export { googleAuth, googleAuthCallback }