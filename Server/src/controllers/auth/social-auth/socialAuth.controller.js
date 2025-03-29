import { ENV } from "../../../config/env.config.js";
import { SERVER } from "../../../constants.js";
import { User } from "../../../models/user.model.js";
import { ApiError } from "../../../utils/apiError.util.js";
import { asyncHandler } from "../../../utils/asyncHandler.util.js";
import generateTokens from "../../../utils/generateTokens.util.js";

const socialAuthCallback = asyncHandler(async (req, res, next) => {
  try {
    const {user} = req;

    if (!user) {
      throw new ApiError(401, "Authentication Failed!");
    }

    // * Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    // * Update user with refresh token
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = Date.now() + SERVER.TOKENS.REFRESH_TOKEN.COOKIE_EXPIRY_MS;

    // * Save user without validation
    await user.save({ validateBeforeSave: false });

    // *  Set secure cookies
    return res
      .status(303)
      .cookie("accessToken", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
      .redirect(`${ENV.CLIENT_URL}/auth-success`);

  } catch (error) {
    const redirectUrl = `${ENV.CLIENT_URL}/login?error=${
      error?.message?.replace(/ /g, "+") || "authentication_failed"
    }`;
    return res.redirect(redirectUrl);
  }
});

const socialAuthFailure = asyncHandler(async (req, res, next) => {
  throw new ApiError(
    401, 
    "Social Authentication Failed! Please Try Again With Different Provider."
  );
});

const unlinkSocialAccount = asyncHandler(async (req, res) => {
  try {
    const { provider } = req.params;
    const userId = req.user._id;

    // * Provider validation
    const validProviders = ["google", "facebook", "github"];
    if (!validProviders.includes(provider)) {
      throw new ApiError(400, "Invalid Social Provider!");
    }

    // * Field mapping
    const providerFieldMap = {
      google: "googleId",
      facebook: "facebookId",
      github: "githubId",
    };
    const socialIdField = providerFieldMap[provider];

    // * User verification
    const user = await User.findById(userId);
    if (!user[socialIdField]) {
      throw new ApiError(400, `Account Not Linked With ${provider}!`);
    }

    // * Login method safety check
    const hasPassword = !!user.password;
    const hasOtherLogins = validProviders
      .filter(p => p !== provider)
      .some(p => user[providerFieldMap[p]]);

    if (!hasPassword && !hasOtherLogins) {
      throw new ApiError(
        400,
        "Cannot Remove Last Login Method! Set Password First."
      );
    }

    // * Perform unlinking
    user[socialIdField] = undefined;
    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { unlinkedProvider: provider },
          `${provider.charAt(0).toUpperCase() + provider.slice(1)} Account Unlinked Successfully!`
        )
      );

  } catch (error) {
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Social Account Unlinking Failed!",
      error,
      error?.stack
    );
  }
});

export { socialAuthCallback, socialAuthFailure, unlinkSocialAccount };