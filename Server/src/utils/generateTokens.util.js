import { User } from "../models/user.model.js";
import { ApiError } from "./apiError.util.js";

const generateTokens = async(userId) => {
  try {
    const accessToken = await User.generateAccessToken(userId)
    const refreshToken = await User.generateRefreshToken(userId)

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Failed To Generate JWT Tokens!");
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error)
    throw new ApiError(
      500,
      error?.message || "Failed To Generate JWT Tokens!",
      error,
      error?.stack
    );
  }
}

export default generateTokens;