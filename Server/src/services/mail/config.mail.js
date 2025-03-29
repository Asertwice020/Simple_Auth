import {
  VERIFICATION_MAIL_TEMPLATE,
  RESET_PASSWORD_SUCCESS_MAIL_TEMPLATE,
  RESET_PASSWORD_REQUEST_MAIL_TEMPLATE,
  WELCOME_MAIL_TEMPLATE,
  TWO_FACTOR_VERIFICATION_MAIL_TEMPLATE,
  TWO_FACTOR_ENABLED_MAIL_TEMPLATE,
  ACCOUNT_LOCKED_MAIL_TEMPLATE,
  BACKUP_CODES_MAIL_TEMPLATE,
  VERIFY_MAIL_REQUEST_MAIL_TEMPLATE
} from './templates.mail.js';

/**
 * MAIL CONFIGURATION
 * 
 * THIS FILE CONTAINS ALL MAIL TEMPLATES CONFIGURATION
 * EACH CONFIGURATION INCLUDES:
 * - TEMPLATE: THE HTML TEMPLATE TO USE
 * - SUBJECT: THE MAIL SUBJECT LINE
 * - ERROR_MESSAGE: CUSTOM ERROR MESSAGE IF SENDING FAILS
 * - PARAM_MAPPER: FUNCTION TO MAP PARAMETERS TO TEMPLATE DATA
 */

const MAIL_CONFIG = {
  // * VERIFICATION MAIL CONFIGURATION
  VERIFICATION: {
    template: VERIFICATION_MAIL_TEMPLATE,
    subject: "Verify Your Mail",
    errorMessage: "Failed To Send Verification Mail!",
    paramMapper: (username, email, params) => ({
      username,
      email,
      verificationCode: params.verificationCode
    })
  },
  
  // * PASSWORD RESET REQUEST MAIL CONFIGURATION
  RESET_PASSWORD_REQUEST: {
    template: RESET_PASSWORD_REQUEST_MAIL_TEMPLATE,
    subject: "Reset Your Password",
    errorMessage: "Failed To Send Password Reset Mail!",
    paramMapper: (username, email, params) => ({
      username,
      email,
      resetURL: params.resetURL
    })
  },
  
  // * WELCOME MAIL CONFIGURATION
  WELCOME: {
    template: WELCOME_MAIL_TEMPLATE,
    subject: "Welcome To Simple Auth Service",
    errorMessage: "Failed To Send Welcome Mail!",
    paramMapper: (username, email) => ({
      username,
    })
  },
  
  // * PASSWORD RESET SUCCESS MAIL CONFIGURATION
  RESET_PASSWORD_SUCCESS: {
    template: RESET_PASSWORD_SUCCESS_MAIL_TEMPLATE,
    subject: "Password Reset Successful",
    errorMessage: "Failed To Send Password Reset Confirmation Mail!",
    paramMapper: (username, email) => ({
      username,
    })
  },
  
  // * TWO FACTOR AUTHENTICATION ENABLED MAIL CONFIGURATION
  TWO_FACTOR_ENABLED: {
    template: TWO_FACTOR_ENABLED_MAIL_TEMPLATE,
    subject: "Two-Factor Authentication Enabled",
    errorMessage: "Failed To Send 2FA Confirmation Mail!",
    paramMapper: (username, email) => ({
      username,
      email
    })
  },

  // * TWO FACTOR AUTHENTICATION VERIFICATION MAIL CONFIGURATION
  TWO_FACTOR_VERIFICATION: {
    template: TWO_FACTOR_VERIFICATION_MAIL_TEMPLATE,
    subject: "Your Two-Factor Authentication Code",
    errorMessage: "Failed To Send 2FA Verification Code!",
    paramMapper: (username, email, params) => ({
      username,
      email,
      verificationCode: params.verificationCode
    })
  },

  // * VERIFY EMAIL REQUEST BY DIRECT LINK ON YOUR MAIL CONFIGURATION => WHEN USER DON'T HAVE A REFRESH-TOKEN TO RENEW TOKEN - You created a temporary token only to verify its email
  VERIFY_MAIL_REQUEST: {
    template: VERIFY_MAIL_REQUEST_MAIL_TEMPLATE,
    subject: "Verify Your Email",
    errorMessage: "Failed To Send Password Verify Mail!",
    paramMapper: (username, email, params) => ({
      username,
      email,
      verifyMailURL: params.verifyMailURL
    })
  },
};

export default MAIL_CONFIG;