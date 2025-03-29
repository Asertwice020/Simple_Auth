import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'
import { User } from "../../models/user.model.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../../config/cookies.config.js'
import { SERVER } from "../../constants.js";
import generateTokens from "../../utils/generateTokens.util.js";
import { sendMail } from "../../services/mail/actions.mail.js";
import { ENV } from "../../config/env.config.js";

const signIn = asyncHandler(async (req, res, next) => {
  try {
    const {email, password} = req.body

    // * check if user exists
    const user = await User.findOne({
      $or: [{ email }],
    });

    if (!user) {
      throw new ApiError(404, "User Does Not Exists!");
    }

    // * compare password
    const isPasswordValid = await User.verifyHashedPassword(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Password!");
    }
    
    // * check if user is verified
    if (!user.isEmailVerified) {
      // * user don't have refresh token - create `tempAccessToken`
      if (!user.refreshToken) {
        // * generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const tempAccessToken = await User.generateAccessToken(user._id, SERVER.TOKENS.TEMP_ACCESS_TOKEN.JWT_EXPIRY || "10m");
        const verifyMailURL = `${ENV.CLIENT_CORS_ORIGIN[0]}/verify-mail?accessToken=${tempAccessToken}&verificationCode=${verificationCode}`

        // * send mail
        const {info, mailSentAt} = await sendMail("VERIFY_MAIL_REQUEST", user.username, email, { verifyMailURL })

        if (!info && !mailSentAt) {
          throw new ApiError(500, "Failed To Send Verify Mail Request Email!").setDebuggingTip("Check mail service configuration and connectivity");
        }

        // * update user
        user.verificationCode = verificationCode;
        user.verificationCodeExpiresAt = mailSentAt + SERVER.MAIL.VERIFICATION_EXPIRY_MS
      
        // * save user
        await user.save({ validateBeforeSave: false });
        
        // * send response
        return res
        .status(200)
        .json(
          new ApiResponse(
            200,            
            "User's Email Is Not Verified! Verification Link Sent To Your Email.",
            { tempAccessToken }
          )
        )
      }

      // * user have refresh / access token - generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
      // * send mail
      const {info, mailSentAt} = await sendMail("VERIFICATION", user.username, email, { verificationCode })

      if (!info && !mailSentAt) {
        throw new ApiError(500, "Failed To Send Verification Email!").setDebuggingTip("Check mail service configuration and connectivity");
      }
    
      // * update user
      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = mailSentAt + SERVER.MAIL.VERIFICATION_EXPIRY_MS
    
      // * save user
      await user.save({ validateBeforeSave: false });
    
      // * send response
      return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User's Email Is Not Verified! Verification Mail Sent Successfully!"
        )
      )
    }

    // * check if 2FA is enabled
    if (user.twoFactorAuthEnabled) {
      // * generate 2FA code
      const code = await user.generate2FACode();

      // * send 2FA code
      const {info, mailSentAt} = await sendMail("TWO_FACTOR_VERIFICATION", user.username, email, { verificationCode })

      if (!info && !mailSentAt) {
        throw new ApiError(500, "Failed To Send 2FA Verification Code Email!")
          .setDebuggingTip("Check mail service configuration and connectivity");
      }
      
      // * send response
      return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User Enabled 2FA! Two Factor Authentication Code Sent To Your Mail Successfully!"
        )
      )
    }
    
    // * generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);
    
    // * update user
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = Date.now() + SERVER.TOKENS.REFRESH_TOKEN.COOKIE_EXPIRY_MS;
    user.lastLogin = Date.now();
    !user.isActive && (user.isActive = true)
    
    // * save user
    await user.save({ validateBeforeSave: false });
    
    // * send response
    return res
    .status(200)
    // * set tokens by cookies
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(200, "Signed In Successful!", {...user._doc, password: null, refreshToken: null, accessToken})
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Signing In!",
      error,
      error?.stack
    );
  }
});

export default signIn