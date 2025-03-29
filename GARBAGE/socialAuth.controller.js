import { ENV } from "./config/env.config.js";

const SERVER = {
  CLIENT_URI: `${ENV.NODE_ENV === 'development' ? `http://localhost:${ENV.PORT}` : `https://localhost:${ENV.PORT}`}`,
  version: "1.0.0",
  JSON_LIMIT: "16kb",
  USERS_AVATAR_STORED_FOLDER: "avatars",
  USERS_AVATAR_MAX_SIZE: "5mb",

  TFA: {
    BACKUP_CODES_COUNT: 8,
    CODE_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
  },

  TOKENS: {
    ACCESS_TOKEN: {
      COOKIE_EXPIRY_MS: 15 * 60 * 1000, // 15 minutes
      JWT_EXPIRY: "15m",
    },
    REFRESH_TOKEN: {
      COOKIE_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
      JWT_EXPIRY: "7d",
    },
  },

  MAIL: {
    VERIFICATION_EXPIRY_MS: 2 * 60 * 1000, // 2 minutes
    RESET_PASSWORD_EXPIRY_MS: 10 * 60 * 1000, // 10 minutes
  },

  LOGGER: {
    LOGS_DIR: "logs",
    LOGS_RETENTION_PERIOD_IN_DB_MS: 7 * 24 * 60 * 60 * 1000, // 7 days - duration for which logs are retained in the database
    LOGS_CLEANUP_INTERVAL_IN_DB_MS: 1 * 60 * 1000, // 1 minute - frequency of the log cleanup operation
    FILE_MAX_SIZE: "5m",
    LOGS_RETENTION_PERIOD_IN_FILE: 3,
  },
  
  MONGODB: {
    CONNECTION_TIMEOUT_MS: 5000, // 5 seconds timeout for initial connection
    SOCKET_TIMEOUT_MS: 45000, // 45 seconds timeout for socket operations
    MAX_RETRY_ATTEMPTS: 5, // Maximum number of retry attempts
    RETRY_INTERVAL_BASE_MS: 1000, // Base retry interval (will be multiplied by 2^retryCount)
    MAX_RETRY_INTERVAL_MS: 30000, // Maximum retry interval (30 seconds)
    AUTO_INDEX: false, // Enable auto indexing in development only
  }
};

const COMPANY = {
  name: "Your Company",
  url: "https://yourcompany.com",
  logo: `${SERVER.CLIENT_URI}/assets/images/company-logo.svg`,
  slogan: "Your Company Slogan",
  description: "Your Company Description",
  
  headquarter_address: "Your Company Headquarters Address",
  contact_email: "contact@yourcompany.com",
  contact_phone: "+1 123-456-7890",
  
  TYPOGRAPHY: {
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "16px",
    lineHeight: "1.6",
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#ef4444"
  },
  
  DEPARTMENTS: {
    SECURITY: {
      name: "Security Team",
      email: "security@yourcompany.com",
      signature: "The Security Team at Your Company"
    },
    SUPPORT: {
      name: "Support Team",
      email: "support@yourcompany.com",
      signature: "The Support Team at Your Company"
    },
  },
  
  SOCIALS: {
    FACEBOOK: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/facebook.svg`,
      url: "https://github.com/Asertwice020"
    },
    INSTAGRAM: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/instagram.svg`,
      url: "https://github.com/Asertwice020"
    },
    LINKEDIN: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/linkedin.svg`,
      url: "https://www.linkedin.com/in/sumit-saraswat-web-dev07/"
    },
    X: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/x.svg`,
      url: "https://x.com/sumit_bindass07"
    },
    YOUTUBE: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/youtube.svg`,
      url: "https://github.com/Asertwice020"
    },
  },
  
  COPYRIGHT: "© 2025 Your Company. All rights reserved.",
  PRIVACY_POLICY_PAGE: "https://yourcompany.com/privacy",
  TERMS_OF_SERVICE_PAGE: 'https://yourcompany.com/terms'
};

export { SERVER, COMPANY };
// * ----------------------

// Roles
const UserRoles = {
  USER: "USER",
  ADMIN: "ADMIN",
}
const AvailableUserRoles = Object.values(UserRoles)

// Login Types
const LoginTypes = {
  GOOGLE: "GOOGLE",
  FACEBOOK: "FACEBOOK",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};
const AvailableLoginTypes = Object.values(LoginTypes);

export { UserRoles, AvailableUserRoles };
export { LoginTypes, AvailableLoginTypes };


// ====================================
// ====================================
// ====================================


import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // Important: This sends cookies with the request
  timeout: 10000, // 10 seconds timeout
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
// Queue of requests to be executed after token refresh
let refreshSubscribers = [];

// Function to add callbacks to the queue
const subscribeToTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Function to execute all callbacks in the queue
const onTokenRefreshed = (accessToken) => {
  refreshSubscribers.forEach(callback => callback(accessToken));
  refreshSubscribers = [];
};

// Function to reject all callbacks in the queue
const onTokenRefreshFailed = (error) => {
  refreshSubscribers.forEach(callback => callback(null, error));
  refreshSubscribers = [];
};

// Token refresh function
const refreshAccessToken = async () => {
  if (isRefreshing) {
    // If already refreshing, return a promise that resolves when the token is refreshed
    return new Promise((resolve, reject) => {
      subscribeToTokenRefresh((token, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.get('http://localhost:8000/api/auth/new-access-token', {
      withCredentials: true,
    });

    const { accessToken } = response.data.data;
    
    // Store the token in memory if needed (not in localStorage for security)
    // localStorage is vulnerable to XSS attacks
    
    isRefreshing = false;
    onTokenRefreshed(accessToken);
    return accessToken;
  } catch (error) {
    isRefreshing = false;
    onTokenRefreshFailed(error);
    
    // Clear any auth state in your app
    clearAuthState();
    
    // Redirect to login page
    window.location.href = '/login';
    return null;
  }
};

// Clear auth state function
const clearAuthState = () => {
  // Clear any in-memory tokens or auth state
  // This depends on how you're storing auth state in your application
  sessionStorage.removeItem('user');
  // Don't try to clear HTTP-only cookies from client side
  // They will be cleared by the server when you hit the logout endpoint
};

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    // You can add the token to the header if you're not using HTTP-only cookies
    // const accessToken = /* get token from your secure storage */;
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or the request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    originalRequest._retry = true;
    
    try {
      const accessToken = await refreshAccessToken();
      
      if (accessToken) {
        // If you're not using HTTP-only cookies, add the token to the header
        // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // If token refresh fails, redirect to login
      clearAuthState();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

// Example API request function that uses the axios instance
const apiRequest = async (method, url, data = null, options = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...options,
    });
    
    return response.data;
  } catch (error) {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server Error:', error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 400:
          // Bad request
          console.error('Bad Request:', error.response.data.message);
          break;
        case 403:
          // Forbidden
          console.error('Access Denied:', error.response.data.message);
          break;
        case 404:
          // Not found
          console.error('Resource Not Found:', error.response.data.message);
          break;
        case 500:
          // Server error
          console.error('Server Error:', error.response.data.message);
          break;
        default:
          console.error(`Error ${error.response.status}:`, error.response.data.message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error: No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Error:', error.message);
    }
    
    throw error;
  }
};

// Usage examples
const authService = {
  login: (email, password) => apiRequest('POST', '/auth/signin', { email, password }),
  register: (userData) => apiRequest('POST', '/auth/signup', userData),
  logout: () => apiRequest('GET', '/auth/logout'),
  refreshToken: refreshAccessToken,
  verifyEmail: (verificationCode) => apiRequest('POST', '/auth/verify-mail', { verificationCode }),
  forgotPassword: (email) => apiRequest('POST', '/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiRequest('POST', `/auth/reset-password/${token}`, { password }),
  changePassword: (currentPassword, newPassword) => 
    apiRequest('POST', '/auth/change-password', { currentPassword, newPassword }),
};

export { api, apiRequest, authService };