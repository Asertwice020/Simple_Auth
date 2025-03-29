import { body, param } from "express-validator";
import { AvailableUserRoles } from "../../constants.js";

// * Username, Email Regex Patterns
const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// * Register Validator
const registerValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty().withMessage("Username Is Required!")
      .matches(USERNAME_REGEX).withMessage("Invalid Username Format!")
      .isLength({ min: 3, max: 20 }).withMessage("Username Must Be Between 3 And 20 Characters!"),
    
    body("email")
      .trim()
      .notEmpty().withMessage("Email Is Required!")
      .matches(EMAIL_REGEX).withMessage("Invalid Email Address!")
      .isEmail().withMessage("Invalid Email Address!"),
    
    body("password")
      .trim()
      .notEmpty().withMessage("Password Is Required!")
      // .isLength({ min: 8 }).withMessage("Password Must Be At Least 8 Characters Long!")
      // .matches(/[A-Z]/).withMessage("Password Must Contain At Least One Uppercase Letter!")
      // .matches(/[a-z]/).withMessage("Password Must Contain At Least One Lowercase Letter!")
      // .matches(/[0-9]/).withMessage("Password Must Contain At Least One Number!")
      // .matches(/[^A-Za-z0-9]/).withMessage("Password Must Contain At Least One Special Character!"),
  ];
};

// * Login Validator
const loginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty().withMessage("Email Is Required!")
      .matches(EMAIL_REGEX).withMessage("Invalid Email Address!")
      .isEmail().withMessage("Invalid Email Address!"),

    body("password")
      .trim()
      .notEmpty().withMessage("Password Is Required!")
      // .isLength({ min: 8 }).withMessage("Password Must Be At Least 8 Characters Long!")
      // .matches(/[A-Z]/).withMessage("Password Must Contain At Least One Uppercase Letter!")
      // .matches(/[a-z]/).withMessage("Password Must Contain At Least One Lowercase Letter!")
      // .matches(/[0-9]/).withMessage("Password Must Contain At Least One Number!")
      // .matches(/[^A-Za-z0-9]/).withMessage("Password Must Contain At Least One Special Character!"),
  ];
};

// * Verify Email Validator
const verifyMailValidator = () => {
  return [
    body("verificationCode")
      .trim()
      .notEmpty().withMessage("Verification Code Is Required!")
      .isLength({ min: 6, max: 6 }).withMessage("Verification Code Must Be 6 Digits!")
      .isNumeric().withMessage("Verification Code Must Contain Only Numbers!"),
  ];
};

// * Forgot Password Validator
const forgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty().withMessage("Email Is Required!")
      .matches(EMAIL_REGEX).withMessage("Invalid Email Address!")
      .isEmail().withMessage("Invalid Email Address!"),
  ];
};

// * Reset Password Validator
const resetPasswordValidator = () => {
  return [
    param("token")
      .trim()
      .notEmpty().withMessage("Reset Token Is Required!"),
    
    body("password")
      .trim()
      .notEmpty().withMessage("Password Is Required!")
      // .isLength({ min: 8 }).withMessage("Password Must Be At Least 8 Characters Long!")
      // .matches(/[A-Z]/).withMessage("Password Must Contain At Least One Uppercase Letter!")
      // .matches(/[a-z]/).withMessage("Password Must Contain At Least One Lowercase Letter!")
      // .matches(/[0-9]/).withMessage("Password Must Contain At Least One Number!")
      // .matches(/[^A-Za-z0-9]/).withMessage("Password Must Contain At Least One Special Character!"),
  ];
};

// * Change Current Password Validator
const changeCurrentPasswordValidator = () => {
  return [
    body("currentPassword")
      .trim()
      .notEmpty().withMessage("Old Password Is Required!"),
      // .isLength({ min: 8 }).withMessage("Password Must Be At Least 8 Characters Long!")
      // .matches(/[A-Z]/).withMessage("Password Must Contain At Least One Uppercase Letter!")
      // .matches(/[a-z]/).withMessage("Password Must Contain At Least One Lowercase Letter!")
      // .matches(/[0-9]/).withMessage("Password Must Contain At Least One Number!")
      // .matches(/[^A-Za-z0-9]/).withMessage("Password Must Contain At Least One Special Character!"),

    body("newPassword")
      .trim()
      .notEmpty().withMessage("New Password Is Required!")
      // .isLength({ min: 8 }).withMessage("Password Must Be At Least 8 Characters Long!")
      // .matches(/[A-Z]/).withMessage("Password Must Contain At Least One Uppercase Letter!")
      // .matches(/[a-z]/).withMessage("Password Must Contain At Least One Lowercase Letter!")
      // .matches(/[0-9]/).withMessage("Password Must Contain At Least One Number!")
      // .matches(/[^A-Za-z0-9]/).withMessage("Password Must Contain At Least One Special Character!")
      .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
          throw new Error("New Password Cannot Be Same As Current Password!");
        }
        return true;
      }),
  ];
};

// *  De-Activate Account Validator
const deactivateAccountValidator = () => {
  return [
    body('confirmText')
      .trim()
      .notEmpty()
      .withMessage('Confirmation text is required')
      .equals('DEACTIVATE MY ACCOUNT')
      .withMessage("Please type 'DEACTIVATE MY ACCOUNT' to confirm"),
    
    body("password")
    .trim()
    .notEmpty().withMessage("Password Is Required!")
    // .isLength({ min: 8 }).withMessage("Password Must Be At Least 8 Characters Long!")
    // .matches(/[A-Z]/).withMessage("Password Must Contain At Least One Uppercase Letter!")
    // .matches(/[a-z]/).withMessage("Password Must Contain At Least One Lowercase Letter!")
    // .matches(/[0-9]/).withMessage("Password Must Contain At Least One Number!")
    // .matches(/[^A-Za-z0-9]/).withMessage("Password Must Contain At Least One Special Character!"),
  ];
};

// *  Remove Account Validator
const removeAccountValidator = () => {
  return [
    body('confirmText')
      .trim()
      .notEmpty()
      .withMessage('Confirmation text is required')
      .equals('DELETE MY ACCOUNT')
      .withMessage("Please type 'DELETE MY ACCOUNT' to confirm permanent deletion"),

      body("password")
      .trim()
      .notEmpty().withMessage("Password Is Required!")
      // .isLength({ min: 8 }).withMessage("Password Must Be At Least 8 Characters Long!")
      // .matches(/[A-Z]/).withMessage("Password Must Contain At Least One Uppercase Letter!")
      // .matches(/[a-z]/).withMessage("Password Must Contain At Least One Lowercase Letter!")
      // .matches(/[0-9]/).withMessage("Password Must Contain At Least One Number!")
      // .matches(/[^A-Za-z0-9]/).withMessage("Password Must Contain At Least One Special Character!"),
  ];
};

// * Assign Role Validator
const assignRoleValidator = () => {
  return [
    body("role")
      .notEmpty().withMessage("Role Is Required!")
      .isIn(AvailableUserRoles).withMessage("Invalid User Role!"),
  ];
};

export {
  registerValidator,
  loginValidator,
  verifyMailValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changeCurrentPasswordValidator,
  deactivateAccountValidator,
  removeAccountValidator,
  assignRoleValidator,
};