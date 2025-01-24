import { SERVER } from "../constants.js";
import { ENV } from "../config/env.config.js";

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "none",
  maxAge: SERVER.ACCESS_TOKEN_COOKIE_MAX_AGE,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "none",
  maxAge: SERVER.REFRESH_TOKEN_COOKIE_MAX_AGE,
};

export { accessTokenCookieOptions, refreshTokenCookieOptions };