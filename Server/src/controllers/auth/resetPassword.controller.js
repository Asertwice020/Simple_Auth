import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'
import { User } from "../../models/user.model.js";
import { ENV } from "../../config/env.config.js";
import jwt from 'jsonwebtoken'
import {sendMail} from '../../services/mail/actions.mail.js'

const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const {token} = req.params;
    const {password} = req.body;

    // * decode token
    const decodedToken = jwt.verify(token, ENV.RESET_PASSWORD_MAIL_JWT_SECRET);

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Reset Password Token!").setDebuggingTips(
        "Check Your Reset Password Token!"
      );
    }

    // * check if user exists
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() }
    })

    if (!user) {
      throw new ApiError(404, "User Does Not Exists!");
    }

    // * update user
    user.password = await User.hashPassword(password);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiresAt = null;

    // * save user
    await user.save({ validateBeforeSave: false });
    
    // * send mail
    const {info, mailSentAt} = await sendMail("RESET_PASSWORD_SUCCESS", user.username, user.email)
    
    if (!info && !mailSentAt) {
      throw new ApiError(500, "Failed To Send Password Reset Success Email!").setDebuggingTips(
        "Check Your Mail Server Configuration!"
      );
    }
    
    // * send response
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Password Reset Successfully!",
      )
    );

  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Resetting Password!",
      error,
      error?.stack
    );
  }
});

export default resetPassword