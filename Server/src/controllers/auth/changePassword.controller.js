import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiError } from "../../utils/apiError.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import { User } from "../../models/user.model.js";

const changePassword = asyncHandler(async (req, res) => {
  try {
    const { body : { currentPassword, newPassword }, userId } = req    

    // * Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User Not Found!")
        .setDebuggingTip("Check if the user ID exists in the database");
    }

    // * compare password
    const isPasswordValid = await User.verifyHashedPassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid Password!").setDebuggingTip("Verify the password matches what's stored in the database");
    }

    // * Update password
    user.password = newPassword;

    // * Save user
    await user.save({ validateBeforeSave: false });

    // * Send response
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Password Changed Successfully!")
      );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error?.message || "Something Went Wrong While Changing Password!",
      error || [],
      error?.stack
    ).setDebuggingTip(error.debuggingTip || "Check password validation and user authentication");
  }
});

export { changePassword };