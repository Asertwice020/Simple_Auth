const CLIENT = {
  SERVER_URI: `${import.meta.env.VITE_NODE_ENV === "development" ? `http://localhost:5500/api/v1` : `${import.meta.env.VITE_SERVER_BASE_URL}`}`,
  version: "1.0.0",

  AXIOS: {
    TIMEOUT: 10000,         // 10s
    INCLUDE_CREDENTIALS: true,
    RETRY: {
      MAX_RETRIES: 1,       // Max general retries
      TOKEN_REFRESH_RETRIES: 1, // Max after token refresh
      RETRY_DELAY: 1000,    // Retry delay (ms)
      NON_RETRYABLE_STATUS_CODES: [400, 401, 403, 404, 422, 500, 501, 503] // Non-retryable codes
    }
  },
  
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Network error. Please check your internet connection.",
    SERVER_ERROR: "Server error. Please try again later.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    NOT_FOUND: "The requested resource was not found.",
    VALIDATION_ERROR: "Please check your input and try again.",
    DEFAULT: "Something went wrong. Please try again."
  }
}

export { CLIENT }


import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiError } from '../../utils/apiError.util.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';
import { User } from "../../models/user.model.js";
import {LoginTypes} from '../../constants.js'

const removeAccount = asyncHandler(async (req, res) => {
  try {
    const { password, confirmText } = req.body;
    const userId = req?.userId;

    // * Validate confirmation text
    if (confirmText !== "DELETE MY ACCOUNT") {
      throw new ApiError(400, "Please Type 'DELETE MY ACCOUNT' To Confirm Account Deletion!");
    }

    // * Find user
    const user = await User.findById(userId);
    
    if (!user) {
      throw new ApiError(404, "User Not Found!");
    }

    // * Verify password if account uses password authentication
    if (user.loginType.includes(LoginTypes.EMAIL_PASSWORD)) {
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