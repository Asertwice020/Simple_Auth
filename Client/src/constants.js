const CLIENT = {
  SERVER_URI: `${import.meta.env.VITE_NODE_ENV === "development" ? 
  `http://localhost:5500/api/v1` : 
  `${import.meta.env.VITE_SERVER_BASE_URL}`}`,
  version: "1.0.0",

  AXIOS: {
    TIMEOUT_MS: 10000, // 10s
    INCLUDE_CREDENTIALS: true,
    RETRY: {
      MAX_RETRIES: 1, // Max general retries
      TOKEN_REFRESH_RETRIES: 1, // Max after token refresh
      RETRY_DELAY_MS: 1000, // Retry delay (ms)
      NON_RETRYABLE_STATUS_CODES: [400, 401, 403, 404, 422, 429, 500, 501, 502, 503, 504] // Non-retryable status codes
    }
  },
  
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Network error. Check internet connection.",
    SERVER_ERROR: "Server unavailable. Try again later.",
    UNAUTHORIZED: "Authentication required.",
    FORBIDDEN: "Insufficient permissions.",
    NOT_FOUND: "Resource not found.",
    VALIDATION_ERROR: "Invalid input data.",
    OFFLINE: "No internet connection.",
    RATE_LIMITED: "Too many requests. Slow down.",
    DEFAULT: "Unexpected error occurred.",
    TIMEOUT: "Request timed out. Please try again."
  }
}

export { CLIENT }