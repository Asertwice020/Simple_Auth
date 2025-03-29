import jwt from 'jsonwebtoken'
import { ENV } from "../config/env.config.js";
import { ApiError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { User } from '../models/user.model.js';

const authHandler = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1] || req.headers?.Authorization?.split(' ')[1] || req.query?.accessToken;
   
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized Request!");
    }

    const decodedToken = jwt.verify(accessToken, ENV.ACCESS_TOKEN_JWT_SECRET);

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Access Token!");
    }
    
    // * Find User
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    
    if (!user) {
      throw new ApiError(401, "Invalid Access Token!");
    }

    // * Set userId In Request
    // req.user = user;
    req.userId = user._id.toString()

    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token!");
  }
})

export default authHandler