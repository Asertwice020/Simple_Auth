import { User } from "../../models/user.model.js";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId); // as i am not using static method here and using _id field only as payload. that's by i have to pull off the whole document here.
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed To Generate JWT Tokens!",
      error,
      error?.stack
    );
  }
}

export default generateTokens