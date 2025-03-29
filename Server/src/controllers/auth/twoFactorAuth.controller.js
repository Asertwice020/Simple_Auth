import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiError } from "../../utils/apiError.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import { User } from "../../models/user.model.js";
import { send2FAVerificationMail, send2FAEnabledMail } from "../../services/mail/actions.mail.js";

const generate2FACode = asyncHandler(async (req, res) => {
  try {
    const { userId } = req;

    // * Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User Not Found!")
        .setDebuggingTip("Verify the user ID from the token is valid");
    }

    // * Check if email is verified
    if (!user.isEmailVerified) {
      throw new ApiError(403, "Email Not Verified!")
        .setDebuggingTip("User must verify their email before enabling 2FA");
    }

    // * Generate 2FA code
    const code = await user.generate2FACode();

    // * Send verification email
    const { info } = await send2FAVerificationMail(user.username, user.email, code);
    if (!info) {
      throw new ApiError(500, "Failed To Send 2FA Verification Email!")
        .setDebuggingTip("Check mail service configuration and connectivity");
    }

    // * Send response
    return res.status(200).json(
      new ApiResponse(200, "2FA Verification Code Sent Successfully!", {
        codeExpiresAt: user.twoFactorAuthCodeExpiresAt
      })
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Something Went Wrong While Generating 2FA Code!",
      error?.errors || [],
      error?.stack
    ).setDebuggingTip(error.debuggingTip || "Check user authentication and email service");
  }
});

/**
 * @desc    Verify 2FA code and enable 2FA
 * @route   POST /api/v1/auth/2fa/verify
 * @access  Private
 */
const verify2FACode = asyncHandler(async (req, res) => {
  try {
    const { userId } = req;
    const { verificationCode } = req.body;

    if (!verificationCode) {
      throw new ApiError(400, "Verification Code Is Required!")
        .setDebuggingTip("Ensure verification code is provided in the request body");
    }

    // * Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User Not Found!")
        .setDebuggingTip("Verify the user ID from the token is valid");
    }

    // * Verify 2FA code
    const isValid = user.verify2FACode(verificationCode);
    if (!isValid) {
      throw new ApiError(400, "Invalid Or Expired Verification Code!")
        .setDebuggingTip("Check if the code matches and hasn't expired");
    }

    // * Enable 2FA
    user.twoFactorAuthEnabled = true;
    
    // * Clear verification code
    await user.clearTwoFactorCode();
    
    // * Generate backup codes
    const backupCodes = await user.generateBackupCodes();

    // * Send confirmation email
    await send2FAEnabledMail(user.email, user.username);

    // * Send response
    return res.status(200).json(
      new ApiResponse(200, "Two-Factor Authentication Enabled Successfully!", {
        backupCodes,
        twoFactorAuthEnabled: true
      })
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Something Went Wrong While Verifying 2FA Code!",
      error?.errors || [],
      error?.stack
    ).setDebuggingTip(error.debuggingTip || "Check verification code validity and user state");
  }
});

/**
 * @desc    Disable 2FA
 * @route   POST /api/v1/auth/2fa/disable
 * @access  Private
 */
const disable2FA = asyncHandler(async (req, res) => {
  try {
    const { userId } = req;
    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, "Password Is Required!")
        .setDebuggingTip("Password confirmation is required for security");
    }

    // * Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User Not Found!")
        .setDebuggingTip("Verify the user ID from the token is valid");
    }

    // * Verify password
    const isPasswordValid = await User.verifyHashedPassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Password!")
        .setDebuggingTip("Password must match the user's current password");
    }

    // * Disable 2FA
    user.twoFactorAuthEnabled = false;
    user.twoFactorAuthBackupCodes = [];
    await user.save({ validateBeforeSave: false });

    // * Send response
    return res.status(200).json(
      new ApiResponse(200, "Two-Factor Authentication Disabled Successfully!", {
        twoFactorAuthEnabled: false
      })
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Something Went Wrong While Disabling 2FA!",
      error?.errors || [],
      error?.stack
    ).setDebuggingTip(error.debuggingTip || "Verify password correctness and user authentication");
  }
});

/**
 * @desc    Verify 2FA during login
 * @route   POST /api/v1/auth/2fa/login
 * @access  Public
 */
const verify2FALogin = asyncHandler(async (req, res) => {
  try {
    const { email, verificationCode, isBackupCode = false } = req.body;

    if (!email || !verificationCode) {
      throw new ApiError(400, "Email And Verification Code Are Required!")
        .setDebuggingTip("Ensure both email and verification code are provided");
    }

    // * Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, "User Not Found!")
        .setDebuggingTip("Check if the email exists in the database");
    }

    // * Verify code based on type
    let isValid = false;
    
    if (isBackupCode) {
      isValid = await user.verifyBackupCode(verificationCode);
      if (!isValid) {
        throw new ApiError(400, "Invalid Or Used Backup Code!")
          .setDebuggingTip("Backup code may be invalid or already used");
      }
    } else {
      isValid = user.verify2FACode(verificationCode);
      if (!isValid) {
        throw new ApiError(400, "Invalid Or Expired Verification Code!")
          .setDebuggingTip("Check if the code matches and hasn't expired");
      }
      await user.clearTwoFactorCode();
    }

    // * Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // * Generate tokens and complete login (similar to your signin controller)
    // ... Your token generation and cookie setting code here

    // * Send response
    return res.status(200).json(
      new ApiResponse(200, "Two-Factor Authentication Verified Successfully!", {
        // ... User data and tokens
      })
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Something Went Wrong During 2FA Verification!",
      error?.errors || [],
      error?.stack
    ).setDebuggingTip(error.debuggingTip || "Check verification code validity and user credentials");
  }
});

/**
 * @desc    Regenerate backup codes
 * @route   POST /api/v1/auth/2fa/backup-codes
 * @access  Private
 */
const regenerateBackupCodes = asyncHandler(async (req, res) => {
  try {
    const { userId } = req;
    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, "Password Is Required!")
        .setDebuggingTip("Password confirmation is required for security");
    }

    // * Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User Not Found!")
        .setDebuggingTip("Verify the user ID from the token is valid");
    }

    // * Check if 2FA is enabled
    if (!user.twoFactorAuthEnabled) {
      throw new ApiError(400, "Two-Factor Authentication Is Not Enabled!")
        .setDebuggingTip("2FA must be enabled to generate backup codes");
    }

    // * Verify password
    const isPasswordValid = await User.verifyHashedPassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Password!")
        .setDebuggingTip("Password must match the user's current password");
    }

    // * Generate new backup codes
    const backupCodes = await user.generateBackupCodes();

    // * Send response
    return res.status(200).json(
      new ApiResponse(200, "Backup Codes Regenerated Successfully!", {
        backupCodes
      })
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Something Went Wrong While Regenerating Backup Codes!",
      error?.errors || [],
      error?.stack
    ).setDebuggingTip(error.debuggingTip || "Verify password correctness and 2FA status");
  }
});

export { 
  generate2FACode, 
  verify2FACode, 
  disable2FA, 
  verify2FALogin, 
  regenerateBackupCodes 
};