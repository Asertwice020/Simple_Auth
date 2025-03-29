# Social Login Controller

```js
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiError } from "../../utils/apiError.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import { ENV } from "../../config/env.config.js";
import { SERVER } from "../../constants.js";
import { User } from "../../models/user.model.js";
import generateTokens from "../../utils/generateTokens.util.js";
import { logger } from "../../config/logger.config.js";

/**
 * @description Controller to handle social authentication callback
 * @route GET /api/v1/auth/google/callback, /api/v1/auth/facebook/callback, etc.
 * @access Public
 */

const socialAuthCallback = asyncHandler(async (req, res, next) => {
  try {
    // * Get user from passport
    const user = req.user;
    
    if (!user) {
      throw new ApiError(401, "Authentication Failed", "No user data received from authentication provider");
    }
    
    // * Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);
    
    // * Set cookies
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: SERVER.TOKENS.ACCESS_TOKEN.COOKIE_EXPIRY_MS
    });
    
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: SERVER.TOKENS.REFRESH_TOKEN.COOKIE_EXPIRY_MS
    });
    
    // Log successful authentication
    logger.info(`User authenticated via social provider: ${user.email}`);
    
    // Redirect to frontend with success
    return res.redirect(`${ENV.CLIENT_URL}/auth-success`);
  } catch (error) {
    // Log error
    logger.error(`Social authentication error: ${error.message}`);
    
    // Redirect to frontend with error
    return res.redirect(`${ENV.CLIENT_URL}/login?error=auth_failed`);
  }
});

/**
 * @description Controller to handle social authentication failure
 * @route GET /api/v1/auth/social/failure
 * @access Public
 */
const socialAuthFailure = asyncHandler(async (req, res) => {
  logger.warn("Social authentication failed");
  return res.status(401).json(
    new ApiResponse(401, null, "Social authentication failed. Please try again.")
  );
});

/**
 * @description Controller to unlink social account
 * @route POST /api/v1/auth/social/unlink/:provider
 * @access Private
 */
const unlinkSocialAccount = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const userId = req.user._id;
  
  // Validate provider
  const validProviders = ['google', 'facebook', 'github', 'microsoft'];
  if (!validProviders.includes(provider)) {
    throw new ApiError(400, "Invalid Provider", "Specified provider is not supported");
  }
  
  // Map provider to field name
  const providerFieldMap = {
    google: 'googleId',
    facebook: 'facebookId',
    github: 'githubId',
    microsoft: 'microsoftId'
  };
  
  const fieldToUnlink = providerFieldMap[provider];
  
  // Check if user has this provider linked
  const user = await User.findById(userId);
  if (!user[fieldToUnlink]) {
    throw new ApiError(400, "Not Linked", `Your account is not linked with ${provider}`);
  }
  
  // Check if user has password or other social logins
  const hasPassword = !!user.password;
  const hasOtherSocialLogins = validProviders.some(p => 
    p !== provider && !!user[providerFieldMap[p]]
  );
  
  if (!hasPassword && !hasOtherSocialLogins) {
    throw new ApiError(
      400, 
      "Cannot Unlink", 
      "You must have at least one login method. Please set a password before unlinking."
    );
  }
  
  // Unlink the provider
  user[fieldToUnlink] = undefined;
  await user.save();
  
  logger.info(`User ${user.email} unlinked ${provider} account`);
  
  return res.status(200).json(
    new ApiResponse(200, { provider }, `Successfully unlinked ${provider} account`)
  );
});

export {
  socialAuthCallback,
  socialAuthFailure,
  unlinkSocialAccount
};
```
---
# Components High Level View

```plaintext
components/
├── auth/                  # Authentication related components
│   ├── LoginForm/
│   ├── SignupForm/
│   ├── SocialLogin/
│   └── VerificationForm/
│
├── common/               # Reusable UI components
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   ├── Card/
│   └── Loading/
│
├── layout/              # Layout components
│   ├── Header/
│   ├── Footer/
│   ├── Sidebar/
│   └── Navigation/
│
├── forms/               # Form-specific components
│   ├── FormFields/
│   └── Validation/
│
├── feedback/           # User feedback components
│   ├── Toast/
│   ├── Alert/
│   └── ErrorBoundary/
│
└── hoc/               # Higher Order Components
    ├── withAuth/
    └── withLoading/
```
---
# Each Component Folder View
```plaintext
ComponentName/
├── index.jsx          # Main component file
├── ComponentName.jsx  # Component implementation
├── ComponentName.css  # Styles
└── ComponentName.test.jsx  # Tests
```
---
SOCIAL AUTH CONTROLLER
```js
import passport from 'passport';
import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js';
import {ApiResponse} from '../../utils/apiResponse.util.js';
import { ENV } from "../../config/env.config.js";
import { SERVER } from "../../constants.js";
import generateTokens from "../../utils/generateTokens.util.js";

// Google Auth controller - initiates Google OAuth flow
const googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Google Auth Callback controller - handles the callback from Google
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { 
    failureRedirect: '/api/v1/auth/social/failure' 
  })(req, res, next, (err) => {
    if (err) return next(err);
    // If authentication succeeds, proceed to socialAuthCallback
    socialAuthCallback(req, res, next);
  });
};

/**
 * @description Controller to handle social authentication callback
 * @route GET /api/v1/auth/google/callback, /api/v1/auth/facebook/callback, etc.
 * @access Public
 */
const socialAuthCallback = asyncHandler(async (req, res, next) => {
  try {
    // Get user from passport
    const user = req.user;
    
    if (!user) {
      throw new ApiError(401, "Authentication Failed", "No user data received from authentication provider");
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);
    
    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production'
    };
    
    // Set cookies
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: SERVER.TOKENS.ACCESS_TOKEN.COOKIE_EXPIRY_MS
    });
    
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: SERVER.TOKENS.REFRESH_TOKEN.COOKIE_EXPIRY_MS
    });
    
    // Redirect to frontend with success
    return res.redirect(`${ENV.CLIENT_URL}/auth-success`);
  } catch (error) {
    // Redirect to frontend with error
    return res.redirect(`${ENV.CLIENT_URL}/login?error=auth_failed`);
  }
});

/**
 * @description Controller to handle social authentication failure
 * @route GET /api/v1/auth/social/failure
 * @access Public
 */
const socialAuthFailure = asyncHandler(async (req, res) => {
  return res.status(401).json(
    new ApiResponse(401, null, "Social authentication failed. Please try again.")
  );
});

export { googleAuth, googleAuthCallback, socialAuthCallback, socialAuthFailure };
```

# VERIFICATION EMAIL TEMPLATE

```
html

const VERIFICATION_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src={COMPANY.logo} alt="Company Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Verify Your Email ✨</h1>
  </div>
  <div style="background: linear-gradient(to bottom, #ffffff, #f5f7ff); padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">Welcome aboard! To begin your journey with us, please verify your email address using the code below:</p>
    <div style="text-align: center; margin: 35px 0;">
      <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 20px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
        <span style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">{verificationCode}</span>
      </div>
    </div>
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0;">Important Information:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">This verification code will expire in 10 minutes</li>
        <li style="margin: 10px 0;">Enter this code on the verification page to activate your account</li>
        <li style="margin: 10px 0;">Keep this code confidential and do not share it with anyone</li>
      </ul>
    </div>
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid #ef4444;">
      <p style="color: #dc2626; font-size: 14px; margin: 0;">If you didn't create an account with us, please contact our security team immediately.</p>
    </div>
    <p style="color: #4a5568; margin-top: 35px;">We're excited to have you join our community!</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: #4f46e5; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.name}</span></p>
  </div>
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.icon}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.icon}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.icon}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.icon}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.icon}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;
```

# HOW TO MAKE EDITABLE INPUTS
```
js

import { useActionState, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { authService } from '../../redux/auth/api.auth';

const VerifyMail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, submitAction, isPending] = useActionState(action);
  
  // State for managing verification code input and editability
  const [inputValue, setInputValue] = useState('');
  const [canModify, setCanModify] = useState(true);

  // Extract query parameters
  const accessToken = searchParams.get('accessToken');
  const verificationCode = searchParams.get('verificationCode');

  // Initialize input value with verification code from URL if available
  useEffect(() => {
    if (verificationCode) {
      setInputValue(verificationCode);
      // By default, don't allow modifying URL-provided verification code
      setCanModify(false);
    }
  }, [verificationCode]);

  // Auto-submit if both params exist
  useEffect(() => {
    if (accessToken && verificationCode) {
      submitAction();
    }
  }, [accessToken, verificationCode, submitAction]);

  // Handle input change
  const handleInputChange = (e) => {
    if (canModify) {
      // Only allow numeric input
      const numericValue = e.target.value.replace(/\D/g, '');
      setInputValue(numericValue);
    }
  };

  // Toggle the ability to modify the verification code
  const toggleCanModify = () => {
    setCanModify(prev => !prev);
  };

  async function action(prevState, formData) {
    try {
      const data = {
        accessToken,
        verificationCode: inputValue || formData.get('verification-code'),
      };

      const response = await authService.verifyMail(data);
      
      if (response?.data?.message.includes(`User Verified Successful`)) {
        alert('Email verified successfully!');
        navigate('/login');
        return { success: true };
      } else {
        return { success: false, message: response?.data?.message };
      }
    } catch (error) {
      return { error: error.message || 'Verification Failed' };
    }
  }

  return (
    <div className="verify-mail-container">
      <form action={submitAction}>
        <h1>Verify Your Email</h1>
        
        {state?.error && (
          <div className="error-message">{state.error}</div>
        )}
        
        {state?.message && (
          <div className="info-message">{state.message}</div>
        )}
        
        <div className="input-group">
          <label htmlFor="verification-code">Verification Code</label>
          <input
            id="verification-code"
            type="text"
            name="verification-code"
            value={inputValue}
            placeholder="Enter 6-digit code"
            inputMode="numeric"
            pattern="\d*"
            maxLength="6"
            required
            autoFocus={!verificationCode}
            onChange={handleInputChange}
            disabled={!canModify && verificationCode}
            className={!canModify && verificationCode ? "readonly" : ""}
          />
          
          {verificationCode && (
            <button 
              type="button" 
              className="toggle-button"
              onClick={toggleCanModify}
            >
              {canModify ? 'Lock Code' : 'Edit Code'}
            </button>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isPending || (inputValue.length < 6)}
          className="submit-button"
        >
          {isPending ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
};

export default VerifyMail;
```