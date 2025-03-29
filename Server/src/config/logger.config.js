import { createLogger, format, transports } from "winston";
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { SERVER } from "../constants.js";
const { combine, timestamp, json, colorize, printf } = format;

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), `${SERVER.LOGGER.LOGS_DIR}`);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Determine log level based on status code and context
const getLogLevel = (statusCode, context = {}) => {
  // Debug / Verbose Information
  if (context.debug) return 'debug';
  if (context.verbose) return 'verbose';
  
  // Server errors (500+)
  if (statusCode >= 500) return 'error';
  // Client errors (400-499)
  if (statusCode >= 400) return 'warn';
  // Redirects (300-399)
  if (statusCode >= 300) return 'info';
  // Successful responses (200-299)
  if (statusCode >= 200) return 'http';
  
  return 'silly';
};

// Define common timestamp format
const commonTimestamp = timestamp({ format: "YYYY-MM-DD HH:mm:ss" });

// Custom format for console logging
const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// File rotation transport - creates new files daily and when size > 10MB
const fileRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logsDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: SERVER.LOGGER.FILE_MAX_SIZE,
  maxFiles: SERVER.LOGGER.LOGS_RETENTION_PERIOD_IN_FILE,
  auditFile: path.join(logsDir, 'log-audit.json'),
  format: combine(commonTimestamp, json()),
});

// Add error handlers for file rotation
fileRotateTransport.on('error', (error) => {
  console.error('File transport error:', error);
});

fileRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info(`Rotating log file from ${oldFilename} to ${newFilename}`);
});

// Create Winston logger
const logger = createLogger({
  levels,
  format: combine(commonTimestamp, json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleLogFormat),
    }),
    fileRotateTransport
  ],
});

export {getLogLevel, logger};