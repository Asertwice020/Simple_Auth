import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'
import { User } from "../../models/user.model.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../../config/cookies.config.js'
import { SERVER } from "../../constants.js";
import generateTokens from "../../utils/generateTokens.util.js";
import {sendMail} from '../../services/mail/actions.mail.js'

const signUp = asyncHandler(async (req, res) => {
  try {
    const {username, email, password} = req.body
    
    // * Check if user already exists
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(
        409,
        "User With This Username or Email Already Exists!"
      ).setDebuggingTip("Check if the username or email is already registered in the database");
    }

    // * Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // * Send verification email
    const {info, mailSentAt} = await sendMail('VERIFICATION', username, email, { verificationCode })


    if (!info && !mailSentAt) {
      throw new ApiError(500, "Failed To Send Verification Email!")
        .setDebuggingTip("Check mail service configuration and connectivity");
    }

    // * Create user document
    const user = await User.create({
      avatar: "",
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password.trim(),
      verificationCode,
      verificationCodeExpiresAt: mailSentAt + SERVER.MAIL.VERIFICATION_EXPIRY_MS,
    });
    
    if (!user) {
      throw new ApiError(500, "Failed To Create User Document In DB!")
        .setDebuggingTip("Check database connection and User model validation");
    }
    
    // * Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    // * Update user with refresh token
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = Date.now() + SERVER.TOKENS.REFRESH_TOKEN.COOKIE_EXPIRY_MS;

    // * Save user without validation
    await user.save({ validateBeforeSave: false });

    // * Send response
    return res
      .status(201)
      // * set token by cookie
      .cookie("accessToken", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
      .json(
        new ApiResponse(201, "User Signed Up Successfully!", {
          ...user._doc, 
          password: null, 
          refreshToken: null,
        })
      );

  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Something Went Wrong While Signing Up!",
      error.errors || [],
      error.stack
    ).setDebuggingTip(error.debuggingTip || "Review the sign-up flow for unexpected failures");
  }
});

export default signUp;