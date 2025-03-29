import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'
import { User } from "../../models/user.model.js";

const logout = asyncHandler(async (req, res, next) => {
  try {
    const {userId} = req;
    
    // * validate user is logged in
    if (!userId) {
      throw new ApiError(401, "User Not Logged In!");
    }

    // * clear cookie field in db
    const user = await User.findById(userId)

    if (!user) {
      throw new ApiError(401, "User Not Found!");
    }

    // * update user
    user.refreshToken = null
    user.refreshTokenExpiresAt = null
    
    // * save user
    await user.save({ validateBeforeSave: false });

    // * send response
    return res
    .status(200)
    // * clear cookies
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
      new ApiResponse(200, "User Logged Out Successfully!")
    );

  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Logging Out!",
      error,
      error?.stack
    );
  }
});

export default logout