import { asyncHandler } from '../../utils/asyncHandler.util.js'
import { ApiError } from '../../utils/apiError.util.js' 
import { ENV } from '../../config/env.config.js';
import jwt from 'jsonwebtoken'
import { User } from '../../models/user.model.js';
import generateTokens from '../../utils/generateTokens.util.js';
import {accessTokenCookieOptions, refreshTokenCookieOptions} from '../../config/cookies.config.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

// * :: i used the `rotation cookie` method here, so i also generate `refreshToken` and update in db
// * :: if this method fails, just re-direct to login page

const generateNewAccessToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      throw new ApiError(401, "Refresh Token Not Found!")
    }

    // * decode token
    const decodedToken = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_JWT_SECRET)

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Refresh Token!");
    }

    // * fetch user by payload id
    const user = await User.findById(decodedToken._id)

    if (!user) {
      throw new ApiError(404, "User Not Found!");
    }

    // * check if refresh token is valid
    if (refreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token!");
    }

    // * generate tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id)

    // * update user
    user.refreshToken = newRefreshToken

    // * save user
    await user.save({ validateBeforeSave: false });

    // * send response
    return res
    .status(200)
    // * set token by cookie
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(200, "New Access Token Generated Successfully!", {refreshToken: newRefreshToken, accessToken})
    );
  } catch (error) {
    throw new ApiError(
      500, error?.message || "Failed To Generate New Access Token!",
      error,
      error?.stack
    );
  }
});

export default generateNewAccessToken