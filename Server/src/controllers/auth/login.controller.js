import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'
import { User } from "../../models/user.model.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../../config/cookies.config.js'
import generateTokens from './generateTokens.js'

const login = asyncHandler(async (req, res, next) => {
  try {
    const {email, password} = req.body

    // * all fields are required
    const emptyFieldsValidation = [email, password].some(
      (field) => !field || field.trim().length === 0
    );

    if (emptyFieldsValidation) {
      throw new ApiError(400, "All Fields Are Required!");
    }

    // * email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      throw new ApiError(400, "Invalid Email Address!");
    }

    // * password length
    if (password.trim().length < 8) {
      throw new ApiError(400, "Password Must Be At Least 8 Characters!");
    }

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
      throw new ApiError(400, "Invalid Password!");
    }

    // * generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    
    // * remove password and refreshToken
    
    // * send response
    return res
    .status(200)
    // * set tokens by cookies
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(200, "Login Successful!", user)
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Logging In!",
      error,
      error?.stack
    );
  }
});

export default login