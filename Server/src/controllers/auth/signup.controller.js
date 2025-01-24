import {asyncHandler} from "../../utils/asyncHandler.util.js";
import {ApiError} from '../../utils/apiError.util.js'
import {ApiResponse} from '../../utils/apiResponse.util.js'
import { User } from "../../models/user.model.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../../config/cookies.config.js'
import generateTokens from './generateTokens.js'

const signup = asyncHandler(async (req, res, next) => {
  try {
    const {username, email, password} = req.body
    
    // * all fields are required
    const emptyFieldsValidation = [username, email, password].some(
      (field) => !field || field.trim().length === 0
    );

    if (emptyFieldsValidation) {
      throw new ApiError(400, "All Fields Are Required!");
    }

    // * username regex
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;

    if (!usernameRegex.test(username.trim())) {
      throw new ApiError(400, "Invalid Username!");
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

    // * does user already exist
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(
        409,
        "User With This Username or Email Already Exists!"
      );
    }
  
    // * create user
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: await User.hashPassword(password),
    })
  
    if (!user) {
      throw new ApiError(500, "Failed To Create User Document In DB!");
    }
  
    // * generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);
    
    // * send response
    return res
    .status(201)
    // * set tokens by cookies
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(200, "Your Account Created Successfully!", {data: {...user, password: null, refreshToken: null}, accessToken})
    );

  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Registering The User!",
      error,
      error?.stack
    );
  }
});

export default signup