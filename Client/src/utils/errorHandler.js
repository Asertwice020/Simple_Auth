import { toast } from 'react-hot-toast';
import { CLIENT } from '../constants';

// Cache for tracking retried requests (with automatic cleanup)
class RetryCache {
  constructor(maxSize = 100, ttl = 60000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  has(key) {
    if (!this.cache.has(key)) return false;
    
    const item = this.cache.get(key);
    const isExpired = Date.now() > item.expiry;
    
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  add(key) {
    // Clean up if cache is too large
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      expiry: Date.now() + this.ttl
    });
  }

  clear() {
    this.cache.clear();
  }
}

const retryCache = new RetryCache();

/**
 * Creates a unique hash for a request to prevent duplicate retries
 * @param {Object} config - Axios request config
 * @returns {string} Hash representing the request
 */
const createRequestHash = (config) => {
  try {
    return `${config.method}-${config.url}-${JSON.stringify(config.data || {})}`;
  } catch (e) {
    return `${config.method}-${config.url}-${Date.now()}`;
  }
};

/**
 * Handles client-side errors with consistent formatting and reporting
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {boolean} showToast - Whether to show a toast notification
 * @returns {Object} Formatted error object
 */
export const handleClientError = (error, context = 'general', showToast = true) => {
  // Handle null/undefined errors
  if (!error) {
    console.error('Undefined error received in', context);
    return createFallbackError(context, showToast);
  }

  // Create base error structure
  const formattedError = {
    message: CLIENT.ERROR_MESSAGES.DEFAULT,
    statusCode: null,
    context,
    originalError: error,
    timestamp: new Date().toISOString(),
    requestInfo: extractRequestInfo(error)
  };

  // Check for offline status first
  if (!navigator.onLine) {
    formattedError.message = CLIENT.ERROR_MESSAGES.OFFLINE;
    formattedError.statusCode = 0;
    return finalizeError(formattedError, context, showToast);
  }

  // Handle timeout errors specifically
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    formattedError.message = CLIENT.ERROR_MESSAGES.TIMEOUT;
    formattedError.statusCode = 408;
    return finalizeError(formattedError, context, showToast);
  }

  // Process Axios error structure
  if (error.response) {
    const { status, data } = error.response;
    formattedError.statusCode = status;
    const safeData = validateResponseData(data);

    // Map status codes to error messages
    switch (status) {
      case 400:
        formattedError.message = safeData.message || CLIENT.ERROR_MESSAGES.VALIDATION_ERROR;
        break;
      case 401:
        formattedError.message = safeData.message || CLIENT.ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case 403:
        formattedError.message = safeData.message || CLIENT.ERROR_MESSAGES.FORBIDDEN;
        break;
      case 404:
        formattedError.message = safeData.message || CLIENT.ERROR_MESSAGES.NOT_FOUND;
        break;
      case 429:
        formattedError.message = CLIENT.ERROR_MESSAGES.RATE_LIMITED;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        formattedError.message = safeData.message || CLIENT.ERROR_MESSAGES.SERVER_ERROR;
        break;
      default:
        formattedError.message = safeData.message || CLIENT.ERROR_MESSAGES.DEFAULT;
    }
  } else if (error.request) {
    // Request made but no response received
    formattedError.message = CLIENT.ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    // Something else caused the error
    formattedError.message = error.message || CLIENT.ERROR_MESSAGES.DEFAULT;
  }

  return finalizeError(formattedError, context, showToast);
};

/**
 * Determines if a request should be retried
 * @param {Error} error - The error object
 * @param {number} retryCount - Current retry count
 * @param {boolean} isTokenRefresh - Whether this is a token refresh retry
 * @returns {boolean} Whether to retry the request
 */
export const shouldRetryRequest = (error, retryCount, isTokenRefresh = false) => {
  // Safety check for missing error
  if (!error || !error.config) {
    return false;
  }

  const { status } = error.response || {};
  const maxRetries = isTokenRefresh
    ? CLIENT.AXIOS.RETRY.TOKEN_REFRESH_RETRIES
    : CLIENT.AXIOS.RETRY.MAX_RETRIES;

  // Prevent infinite token refresh loops
  if (isTokenRefresh && retryCount > 0) {
    console.warn('Aborting retry after failed token refresh');
    return false;
  }

  // Don't retry if we've reached max retries
  if (retryCount >= maxRetries) {
    return false;
  }

  // Special case for uploads - use upload config
  if (error.config.url?.includes('/upload') || error.config._isUpload) {
    return retryCount < CLIENT.AXIOS.UPLOAD_CONFIG.MAX_RETRIES;
  }

  // Block retries for non-retryable status codes
  if (status && CLIENT.AXIOS.RETRY.NON_RETRYABLE_STATUS_CODES.includes(status)) {
    // Special case: Always retry once for 401 if it's a token refresh
    if (status === 401 && isTokenRefresh && retryCount === 0) {
      return true;
    }
    return false;
  }

  // Prevent duplicate retries for same request
  const requestKey = createRequestHash(error.config);
  if (retryCache.has(requestKey)) {
    return false;
  }
  retryCache.add(requestKey);

  // Default: retry if under max retries
  return true;
};

/**
 * Finalizes error processing with logging and notifications
 * @param {Object} error - Formatted error object
 * @param {string} context - Error context
 * @param {boolean} showToast - Whether to show toast
 * @returns {Object} The finalized error
 */
const finalizeError = (error, context, showToast) => {
  // Track error for analytics/monitoring
  trackError(error);
  
  // Log error for debugging
  console.error(`[${context.toUpperCase()}] Error:`, 
    JSON.stringify({
      ...error,
      originalError: error.originalError ? error.originalError.toString() : null
    }, null, 2)
  );

  // Show toast notification if enabled
  if (showToast && !error.suppressToast) {
    toast.error(error.message);
  }

  return error;
};

/**
 * Validates and safely parses response data
 * @param {any} data - Response data to validate
 * @returns {Object} Safe data object
 */
const validateResponseData = (data) => {
  if (!data) return {};
  if (typeof data === 'object') return data;
  
  try {
    return JSON.parse(data);
  } catch {
    return { message: `Unexpected response format: ${typeof data}` };
  }
};

/**
 * Tracks errors in monitoring systems if available
 * @param {Object} error - Formatted error object
 */
const trackError = (error) => {
  // Send to error monitoring if available
  if (window.Sentry) {
    window.Sentry.captureException(error.originalError, {
      contexts: { 
        error: { 
          ...error,
          originalError: undefined // Avoid circular references
        } 
      },
      tags: {
        context: error.context,
        statusCode: error.statusCode
      }
    });
  }
  
  // Could add other monitoring services here
};

/**
 * Creates a fallback error when the original error is missing
 * @param {string} context - Error context
 * @param {boolean} showToast - Whether to show toast
 * @returns {Object} Fallback error object
 */
const createFallbackError = (context, showToast) => {
  const error = {
    message: CLIENT.ERROR_MESSAGES.DEFAULT,
    statusCode: 500,
    context,
    timestamp: new Date().toISOString()
  };
  
  if (showToast) {
    toast.error(error.message);
  }
  
  return error;
};

/**
 * Extracts useful request information from an error
 * @param {Error} error - The error object
 * @returns {Object} Request information
 */
const extractRequestInfo = (error) => {
  if (!error.config) return {};
  
  return {
    url: error.config.url,
    method: error.config.method,
    timestamp: new Date().toISOString()
  };
};