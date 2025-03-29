import {Router} from 'express';
import { signUp, signIn, logout, verifyMail, generateNewAccessToken, forgotPassword, resetPassword, changePassword, deactivateAccount, removeAccount } from '../controllers/auth/index.js'
import { googleAuth, googleAuthCallback, socialAuthFailure } from '../controllers/auth/social-auth/index.js'
import authHandler from '../middlewares/auth.middleware.js'
import { forgotPasswordValidator, loginValidator, registerValidator, resetPasswordValidator, verifyMailValidator, changeCurrentPasswordValidator, deactivateAccountValidator, removeAccountValidator } from '../validators/auth/auth.validator.js';
import { validate } from '../validators/validate.js';

const router = Router();

/** Route Mapping
 * 
 * @public - POST /api/auth/signup
 * @public - POST /api/auth/signin
 * @private - POST /api/auth/verify-mail
 * @private - POST /api/auth/logout
 * @private - POST /api/auth/forgot-password
 * @private - POST /api/auth/reset-password
 * @private - POST /api/auth/change-password
 * 
 */

// * un-secured routes
router.route('/signup').post(registerValidator(), validate, signUp) // ✅
router.route('/signin').post(loginValidator(), validate, signIn) // ✅

// * Social Login Types
// Google OAuth routes
router.route('/google').get(googleAuth);
router.route('/google/callback').get(googleAuthCallback);
router.route('/social/failure').get(socialAuthFailure);

// * secured routes
router.route('/renew-token').get(generateNewAccessToken) // ✅
router.route('/forgot-password').post(forgotPasswordValidator(), validate, forgotPassword) // ✅
router.route('/reset-password/:token').post(resetPasswordValidator(), validate, resetPassword) // ✅
router.route('/change-password').post(authHandler, changeCurrentPasswordValidator(), validate, changePassword) // ✅

router.route('/logout').get(authHandler, logout) // ✅
router.route('/verify-mail').post(authHandler, verifyMailValidator(), validate, verifyMail) // ✅

// * Account management routes
router.route('/deactivate-account').post(authHandler, deactivateAccountValidator(), validate, deactivateAccount) // ✅
router.route('/remove-account').post(authHandler, removeAccountValidator(), validate, removeAccount) // ✅

// * 2FA routes
// router.route('/2fa/verify').post()

export {router}