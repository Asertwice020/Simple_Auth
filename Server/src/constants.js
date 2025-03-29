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
    TEMP_ACCESS_TOKEN: {
      COOKIE_EXPIRY_MS: 10 * 60 * 1000, // 10 minutes
      JWT_EXPIRY: "10m",
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
  // Placeholder for base64 encoded logo
  logoBase64: "base64 encoding for company-logo",
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
  
  COLORS: {
    primary: {
      light: "#818cf8",
      main: "#6366f1",
      dark: "#4f46e5",
      gradient: "linear-gradient(135deg, #6366f1, #4f46e5)"
    },
    secondary: {
      light: "#a5b4fc",
      main: "#818cf8",
      dark: "#6366f1"
    },
    success: {
      light: "#34d399",
      main: "#10b981",
      dark: "#059669",
      gradient: "linear-gradient(135deg, #10B981, #059669)"
    },
    warning: {
      light: "#fbbf24",
      main: "#f59e0b",
      dark: "#d97706",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    error: {
      light: "#f87171",
      main: "#ef4444",
      dark: "#dc2626",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    },
    background: {
      light: "#ffffff",
      main: "#f9fafb",
      dark: "#f3f4f6",
      gradient: "linear-gradient(to bottom, #ffffff, #f5f7ff)"
    }
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
      iconBase64: "base64 encoding for facebook-icon",
      url: "https://github.com/Asertwice020"
    },
    INSTAGRAM: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/instagram.svg`,
      iconBase64: "base64 encoding for instagram-icon",
      url: "https://github.com/Asertwice020"
    },
    LINKEDIN: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/linkedin.svg`,
      iconBase64: "base64 encoding for linkedin-icon",
      url: "https://www.linkedin.com/in/sumit-saraswat-web-dev07/"
    },
    X: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/x.svg`,
      iconBase64: "base64 encoding for x-icon",
      url: "https://x.com/sumit_bindass07"
    },
    YOUTUBE: {
      icon: `${SERVER.CLIENT_URI}/assets/icons/youtube.svg`,
      iconBase64: "base64 encoding for youtube-icon",
      url: "https://github.com/Asertwice020"
    },
  },
  
  COPYRIGHT: "© 2025 Your Company. All rights reserved.",
  PRIVACY_POLICY_PAGE: "https://yourcompany.com/privacy",
  TERMS_OF_SERVICE_PAGE: 'https://yourcompany.com/terms',
  UNSUBSCRIBE: 'https://yourcompany.com/unsubscribe'
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