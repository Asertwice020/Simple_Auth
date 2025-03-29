import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiError } from '../../utils/apiError.util.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';
import { User } from "../../models/user.model.js";
import {LoginTypes} from '../../constants.js'

const removeAccount = asyncHandler(async (req, res) => {
  try {
    const { password, confirmText } = req.body;
    const userId = req?.userId;

    // // * Validate confirmation text
    // if (confirmText !== "DELETE MY ACCOUNT") {
    //   throw new ApiError(400, "Please Type 'DELETE MY ACCOUNT' To Confirm Account Deletion!");
    // }

    // * Find user
    const user = await User.findById(userId);
    
    if (!user) {
      throw new ApiError(404, "User Not Found!");
    }

    // * Verify password if account uses password authentication
    if (user.loginType.includes(LoginTypes.EMAIL_PASSWORD)) {
      console.log(` i am using ${LoginTypes.EMAIL_PASSWORD} as the :: auth option`)
      if (!password) {
        throw new ApiError(400, "Password Is Required To Delete Account!");
      }

      const isPasswordValid = await User.verifyHashedPassword(password, user.password);
      
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password!");
      }
    }

    // * Permanently delete the user account
    await User.findByIdAndDelete(userId);
    
    // * Send response
    return res
      .status(200)
      // * Clear cookies
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(
        new ApiResponse(
          200, 
          "Account Permanently Deleted Successfully! All Your Data Has Been Removed."
        )
      );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Something Went Wrong While Deleting Account!",
      error,
      error?.stack
    );
  }
});

export {removeAccount};