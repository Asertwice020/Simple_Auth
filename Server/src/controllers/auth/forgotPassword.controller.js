import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'
import { User } from "../../models/user.model.js";
import { SERVER } from "../../constants.js";
import { ENV } from "../../config/env.config.js";
import { sendMail } from "../../services/mail/actions.mail.js";

const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    const {email} = req.body

    // * check if user exists
    const user = await User.findOne({
      email: email
    });

    if (!user) {
      throw new ApiError(404, "User Not Found!");
    }

    // * generate reset password token
    const resetPasswordToken = await User.generateResetPasswordToken();
    const resetURL = `${ENV.CLIENT_CORS_ORIGIN[0]}/reset-password/${resetPasswordToken}`
    
    // * send mail
    const {info, mailSentAt} = await sendMail("RESET_PASSWORD_REQUEST", user.username, email, { resetURL })
    
    if (!info && !mailSentAt) {
      throw new ApiError(500, "Failed To Send Password Reset Email!").setDebuggingTip("Check mail service configuration and connectivity");
    }
    
    // * update user
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiresAt = mailSentAt + SERVER.MAIL.RESET_PASSWORD_EXPIRY_MS;

    // * save user
    await user.save({ validateBeforeSave: false });

    // * send response
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Password Reset Mail Sent Successfully!"
      )
    );

  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Sending Password Reset Mail!",
      error,
      error?.stack
    );
  }
});

export default forgotPassword