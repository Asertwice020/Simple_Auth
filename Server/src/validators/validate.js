import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.util.js";

const validate = (req, res, next) => {
  // * Get validation errors from express-validator
  const errors = validationResult(req);
  
  // * If no errors, proceed to next middleware
  if (errors.isEmpty()) {
    return next();
  }
  
  // * Format errors for consistent response
  const extractedErrors = [];
  
  errors.array().forEach((err) => {
    extractedErrors.push({ [err.path]: err.msg });
  });

   // * Use the first validation error message as the main error message
   const primaryErrorMessage = errors.array()[0].msg;

  // * 422: Unprocessable Entity - throw ApiError to be caught by errorHandler
  throw new ApiError(
    422, 
    primaryErrorMessage || "Validation Failed!",
    "Make Sure All Required Fields Are Properly Formatted.",
    extractedErrors
  );
};

export { validate };