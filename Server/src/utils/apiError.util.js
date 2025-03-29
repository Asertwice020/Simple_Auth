class ApiError extends Error {
  constructor(
    statusCode = null,
    message = "API ERROR HAPPENED (DEFAULT-MSG)",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.debuggingTip = null,
    this.error = {
      errors: Array.isArray(errors) ? errors : [errors],
      stack: stack || "",
    };
    this.data = null;
    this.success = false;

    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // * Add method to set debugging tip
  setDebuggingTip(tip) {
    this.debuggingTip = tip;
    return this;
  }
}

export { ApiError };
