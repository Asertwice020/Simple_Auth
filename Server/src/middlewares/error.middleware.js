import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.util.js";
import { ENV } from "../config/env.config.js";

const errorHandler = (error, req, res, next) => {
  // * Convert non-ApiError to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    const message = error.message || "Something Went Wrong!";
    
    error = new ApiError(
      statusCode, 
      message,
      error?.errors || [],
      error.stack
    );
  }

  // * Log Error
  console.error(`ERROR: ${error.message}`);

  // * Create response object with the desired structure
  const responseObj = {
    statusCode: error.statusCode,
    message: error.message,
    error: {
      errors: error.error.errors,
      ...(ENV.NODE_ENV === "development" ? { stack: error.error.stack } : {})
    },
    data: null,
    success: false
  };

  // * Add debuggingTip only in development and if it exists
  if (ENV.NODE_ENV === "development" && error.debuggingTip) {
    responseObj.debuggingTip = error.debuggingTip;
  }

  return res.status(error.statusCode).json(responseObj);
};

export { errorHandler };