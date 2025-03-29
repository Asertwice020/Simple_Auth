import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'
import { User } from "../../models/user.model.js";
import { sendMail } from "../../services/mail/actions.mail.js";

const verifyMail = asyncHandler(async (req, res) => {
  try {
    const {verificationCode} = req.body || req.query
    const { userId } = req

    // * Check if user exists
    const user = await User.findOne({
      _id: userId,
      isEmailVerified: false
		});

    if (!user) {
      throw new ApiError(404, "User Does Not Exists!")
        .setDebuggingTip("Check if the user ID exists and if the email is already verified");
    }

    // * Check if verification code is correct and not expired
    if (verificationCode !== user.verificationCode || user.verificationCodeExpiresAt < Date.now()) {
      throw new ApiError(400, "Invalid or Expired Verification Code!")
        .setDebuggingTip("Verify the code matches and hasn't expired. Consider checking the expiration time calculation");
    }

    // * Update user
    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    user.lastLogin = Date.now();

    // * Save user
    await user.save();

    // * Send welcoming mail
    const { info, mailSentAt} = await sendMail("WELCOME", user.username, user.email);

    if (!info && !mailSentAt) {
      throw new ApiError(500, "Failed To Send Welcome Email!")
        .setDebuggingTip("Check mail service configuration and connectivity");
    }


    // * Data Object
    const data = {
      user: {
        ...user._doc,
        password: null,
        refreshToken: null
      },
      navigate: user.isEmailVerified ? "/" : "/login"
    };

    // * Send response
    return res
    .status(200)
    .json(
      new ApiResponse(200, "User Verified Successful!", data)
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Something Went Wrong While Verifying User!",
      error || [],
      error?.stack
    ).setDebuggingTip(error.debuggingTip || "Review the email verification flow and check user authentication");
  }
});

export default verifyMail
