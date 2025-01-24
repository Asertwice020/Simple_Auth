import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.config.js";
import bcrypt from 'bcryptjs'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username Is Required!"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email Is Required!"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password Is Required!"],
      min: 8,
      max: 25,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.statics.getCurrentUserId = function (refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET);
    return decoded._id;
  } catch (error) {
    throw new Error(error.message || "Failed To Get Current User Id!");
  }
}

userSchema.statics.hashPassword = async function (plainPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(error.message || "Failed To Hash Password!");
  }
}

userSchema.statics.verifyHashedPassword = async function (plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(error.message || "Failed To Verify Password!");
  }
}

// !NOTE: while signing the JWT tokens, if you are passing only the _id, as the payload. so it's better to use the - static methods instead of general methods methods.
/*
Static Methods: userSchema.statics.generateToken => Better when you only need the userId or partial user data. They are efficient, reusable, and avoid unnecessary queries.
Instance Methods: userSchema.methods.generateToken => Useful when token generation depends on data only available in the full user document.
*/
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: ENV.ACCESS_TOKEN_JWT_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: ENV.REFRESH_TOKEN_JWT_EXPIRY }
  );
};

const User = model("User", userSchema);
export { User };
