import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.config.js";
import bcrypt from 'bcryptjs'
import { SERVER, AvailableLoginTypes, AvailableUserRoles, LoginTypes, UserRoles } from "../constants.js";

const userSchema = new Schema(
  {
    avatar: {
      type: String,
      default: "",
    },

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
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: AvailableUserRoles,
      default: UserRoles.USER,
    },

    password: {
      type: String,
      required: function() { return this.loginType === LoginTypes.EMAIL_PASSWORD },
      validate: {
        validator: function(value) {
          if (!value && (this.googleId || this.facebookId || this.githubId)) {
            return true;
          }          
          return value && value.length >= 8;
        },
      }
    },

    twoFactorAuthEnabled: {
      type: Boolean,
      default: false
    },

    twoFactorAuthCode: {
      type: String,
      default: null
    },

    twoFactorAuthCodeExpiresAt: {
      type: Date,
      default: null
    },

    twoFactorAuthBackupCodes: [{
      code: String,
      used: {
        type: Boolean,
        default: false
      }
    }],

    loginType: {
      type: [String],
      required: true,
      enum: AvailableLoginTypes,
      default: [LoginTypes.EMAIL_PASSWORD],
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    refreshTokenExpiresAt: {
      type: Date,
      default: null,
    },

    verificationCode: {
      type: String,
      default: null,
    },

    verificationCodeExpiresAt: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordTokenExpiresAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deactivatedAt: {
      type: Date,
      default: null,
    },

    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },

    // isBanned: {
    //   type: Boolean,
    //   default: false,
    // },

    // isBlocked: {
    //   type: Boolean,
    //   default: false,
    // },
    
    googleId: {
      type: String,
      sparse: true
    },

    facebookId: {
      type: String,
      sparse: true
    },

    githubId: {
      type: String,
      sparse: true
    },

    
  },
  { timestamps: true }
);

// !NOTE: while signing the JWT tokens, if you are passing only the _id, as the payload. so it's better to use the - static methods instead of general methods methods.
/*
Static Methods: userSchema.statics.generateToken => Better when you only need the userId or partial user data. They are efficient, reusable, and avoid unnecessary queries.
Instance Methods: userSchema.methods.generateToken => Useful when token generation depends on data only available in the full user document.
*/

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(new Error(error.message || "Failed To Hash Password!"));
  }
});

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

userSchema.statics.generateAccessToken = function (userId, expiry) {
  return jwt.sign(
    {
      _id: userId
    },
    ENV.ACCESS_TOKEN_JWT_SECRET,
    { expiresIn: expiry || SERVER.TOKENS.ACCESS_TOKEN.JWT_EXPIRY }
  );
};

userSchema.statics.generateRefreshToken = function (userId) {
  return jwt.sign(
    {
      _id: userId
    },
    ENV.REFRESH_TOKEN_JWT_SECRET,
    { expiresIn: SERVER.TOKENS.REFRESH_TOKEN.JWT_EXPIRY }
  );
};

userSchema.statics.generateResetPasswordToken = function () {
  return jwt.sign(
    {},
    ENV.RESET_PASSWORD_MAIL_JWT_SECRET,
    { expiresIn: ENV.RESET_PASSWORD_MAIL_JWT_EXPIRY }
  );
};

// * 2FA Methods
userSchema.methods.generate2FACode = async function() {
  // * Generate verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.twoFactorAuthCode = code;
  this.twoFactorAuthCodeExpiresAt = new Date(Date.now() + SERVER.TFA.CODE_EXPIRY_MS);
  
  // * Save user
  await this.save({ validateBeforeSave: false });
  
  return code;
};

userSchema.methods.verify2FACode = function(code) {
  // * Check if code matches and is not expired
  if (
    this.twoFactorAuthCode === code &&
    this.twoFactorAuthCodeExpiresAt > new Date()
  ) {
    return true;
  }
  return false;
};

userSchema.methods.clearTwoFactorCode = async function() {
  this.twoFactorAuthCode = null;
  this.twoFactorAuthCodeExpiresAt = null;
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.generateBackupCodes = async function() {
  // * Generate 8 backup codes
  const backupCodesCount = SERVER.TFA.BACKUP_CODES_COUNT || 8;

  const backupCodes = [];
  for (let i = 0; i < backupCodesCount; i++) {
    const code = Math.random().toString(36).substring(2, 12).toUpperCase();
    backupCodes.push({
      code: code,
      used: false
    });
  }
  
  this.twoFactorAuthBackupCodes = backupCodes;
  await this.save({ validateBeforeSave: false });
  
  return backupCodes.map(bc => bc.code);
};

userSchema.methods.verifyBackupCode = async function(code) {
  const backupCode = this.twoFactorAuthBackupCodes.find(
    bc => bc.code === code && !bc.used
  );
  
  if (backupCode) {
    backupCode.used = true;
    await this.save({ validateBeforeSave: false });
    return true;
  }
  
  return false;
};

const User = model("User", userSchema);
export { User };