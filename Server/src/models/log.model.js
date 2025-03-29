import { Schema, model } from "mongoose";
import { SERVER } from "../constants.js";

const logSchema = new Schema({
  level: {
    type: String,
    required: true,
    enum: ["error", "warn", "info", "http", "verbose", "debug", "silly"]
  },
  message: {
    type: String,
    required: true
  },
  timestamp: Date,
}
);

// Add cleanup method
logSchema.statics.cleanup = async function(seconds = SERVER.LOGGER.LOGS_RETENTION_PERIOD_IN_DB_MS) {
  const cutoffDate = new Date(Date.now() - seconds);
  return this.deleteMany({ timestamp: { $lt: cutoffDate } });
};

// Set up auto-cleanup interval
setInterval(() => Log.cleanup(SERVER.LOGGER.LOGS_RETENTION_PERIOD_IN_DB_MS), SERVER.LOGGER.LOGS_CLEANUP_INTERVAL_IN_DB_MS);

const Log = model("Log", logSchema);

export { Log };