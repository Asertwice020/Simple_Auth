import { getLogLevel, logger } from "../config/logger.config.js";
import {Log} from '../models/log.model.js'

// Logger middleware
const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Override end method to capture response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;
    const level = getLogLevel(statusCode);
    
    const logMessage = {
      method: req.method,
      url: req.originalUrl,
      status: statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip
    };
    
    // Log to Winston (file + console)
    logger[level](JSON.stringify(logMessage));
    
    // Log to MongoDB
    Log.create({
      level,
      message: JSON.stringify(logMessage),
      timestamp: new Date()
    }).catch(err => console.error("MongoDB logging error:", err));
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Error logger middleware
const errorLoggerMiddleware = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path
  });
  
  Log.create({
    level: "error",
    message: JSON.stringify({
      message: err.message,
      path: req.path,
      method: req.method
    }),
    timestamp: new Date()
  }).catch(err => console.error("MongoDB error logging error:", err));
  
  next(err);
};

export { loggerMiddleware, errorLoggerMiddleware };