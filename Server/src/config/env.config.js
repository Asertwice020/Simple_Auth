import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const validateEnvVar = (varName, expectedType) => {
  const value = process.env[varName];

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }

  // Convert before type check
  let convertedValue;
  if (expectedType === "number") {
    convertedValue = Number(value);
  } else if (expectedType === "array") {
    convertedValue = value.split(",").map((domain) => domain.trim());
  } else {
    convertedValue = value;
  }

  if (
    typeof convertedValue !== expectedType &&
    !Array.isArray(convertedValue)
  ) {
    throw new Error(
      `Invalid type for environment variable: ${varName}. Expected ${expectedType}, got ${typeof value}`
    );
  }

  return convertedValue;
};

const ENV = {
  PORT: validateEnvVar("PORT", "number"),

  MONGODB_URI: validateEnvVar("MONGODB_URI", "string"),

  ACCESS_TOKEN_JWT_SECRET: validateEnvVar("ACCESS_TOKEN_JWT_SECRET", "string"),

  REFRESH_TOKEN_JWT_SECRET: validateEnvVar("REFRESH_TOKEN_JWT_SECRET", "string"),

  CLIENT_CORS_ORIGIN: validateEnvVar("CLIENT_CORS_ORIGIN", "array"),

  NODE_ENV: validateEnvVar("NODE_ENV", "string"),

  NODE_MAILER_GOOGLE_EMAIL: validateEnvVar("NODE_MAILER_GOOGLE_EMAIL", "string"),

  NODE_MAILER_GOOGLE_PASS: validateEnvVar( "NODE_MAILER_GOOGLE_PASS", "string" ),

  RESET_PASSWORD_MAIL_JWT_SECRET: validateEnvVar("RESET_PASSWORD_MAIL_JWT_SECRET", "string"),

  RESET_PASSWORD_MAIL_JWT_EXPIRY: validateEnvVar(
    "RESET_PASSWORD_MAIL_JWT_EXPIRY",
    "string"
  ),

  GOOGLE_CLIENT_ID: validateEnvVar("GOOGLE_CLIENT_ID", "string"),
  GOOGLE_CLIENT_SECRET: validateEnvVar("GOOGLE_CLIENT_SECRET", "string"),
  GOOGLE_CALLBACK_URI: validateEnvVar("GOOGLE_CALLBACK_URI", "string"),
 
  FACEBOOK_APP_ID: validateEnvVar("FACEBOOK_APP_ID", "string"),
  FACEBOOK_APP_SECRET: validateEnvVar("FACEBOOK_APP_SECRET", "string"),
  FACEBOOK_CALLBACK_URI: validateEnvVar("FACEBOOK_CALLBACK_URI", "string"),
 
  GITHUB_CLIENT_ID: validateEnvVar("GITHUB_CLIENT_ID", "string"),
  GITHUB_CLIENT_SECRET: validateEnvVar("GITHUB_CLIENT_SECRET", "string"),
  GITHUB_CALLBACK_URI: validateEnvVar("GITHUB_CALLBACK_URI", "string"),

};

export { ENV };
