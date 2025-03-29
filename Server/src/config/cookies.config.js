import { SERVER } from "../constants.js";
import { ENV } from "../config/env.config.js";

const userTokenCookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: SERVER.USER_TOKEN_COOKIE_MAX_AGE,
}

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: SERVER.TOKENS.ACCESS_TOKEN.COOKIE_EXPIRY_MS,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: SERVER.TOKENS.REFRESH_TOKEN.COOKIE_EXPIRY_MS,
};

export { accessTokenCookieOptions, refreshTokenCookieOptions, userTokenCookieOptions };