import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.util.js";
import { ENV } from "./env.config.js";
import { SERVER } from "../constants.js";

// * Singleton pattern: Track connection status globally
let isConnected = false;
let isConnecting = false; // Prevent multiple simultaneous connection attempts

// 1. Use autoIndex in development only
// 2. Configure proper timeouts
// 3. Handle connection events properly
const connectionOptions = {
  autoIndex: SERVER.MONGODB.AUTO_INDEX,
  serverSelectionTimeoutMS: SERVER.MONGODB.CONNECTION_TIMEOUT_MS,
  socketTimeoutMS: SERVER.MONGODB.SOCKET_TIMEOUT_MS,
};

const ConnectDB = async () => {
  try {
    // Connection state management: Skip if already connected/connecting
    if (isConnected) {
      console.log("Using existing MongoDB connection");
      return mongoose.connection;
    }
    if (isConnecting) {
      console.log("Connection attempt already in progress");
      return mongoose.connection;
    }

    isConnecting = true;    
    const connectionInstance = await mongoose.connect(ENV.MONGODB_URI, connectionOptions);
    
    // Event listener cleanup: Remove old listeners first
    mongoose.connection.removeAllListeners("error");
    mongoose.connection.removeAllListeners("disconnected");
    
    // Event listeners for connection issues
    mongoose.connection.on("error", (error) => {
      console.error(`MongoDB connection error: ${error}`);
      isConnected = false;
      reconnectWithRetry();
    });
    
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
      isConnected = false;
      reconnectWithRetry();
    });

    // Improved host logging
    console.log(`\nMongo DB connected!! DB HOST :: ${connectionInstance.connection.host}`); // LOG
    
    isConnected = true;
    isConnecting = false;
    return connectionInstance;

  } catch (error) {
    isConnecting = false;
    const errorObj = new ApiError(
      503,
      `Facing an issue while connecting to MONGODB :: DB/index.js`,
      "1. INTERNET  2. IP ADDRESS IN NETWORK ACCESS TAB OF MONGO DB  3. REMOVE LAST '/' FROM CONNECTION STRING  4. CONFIG ENV ARE LOADING PROPERLY",
      error,
      error?.stack,
    );
    console.error(errorObj);
    
    return reconnectWithRetry();
  }
};

const reconnectWithRetry = async (retryCount = 0) => {
  // Connection state management: Check current connection status
  if (mongoose.connection.readyState === 1) { // 1 = connected
    console.log("Already connected to MongoDB");
    return mongoose.connection;
  }

  if (retryCount >= SERVER.MONGODB.MAX_RETRY_ATTEMPTS) {
    console.error(`Failed to connect to MongoDB after ${SERVER.MONGODB.MAX_RETRY_ATTEMPTS} attempts. Exiting...`);
    process.exit(1);
  }
  
  const retryDelay = Math.min(
    Math.pow(2, retryCount) * SERVER.MONGODB.RETRY_INTERVAL_BASE_MS, 
    SERVER.MONGODB.MAX_RETRY_INTERVAL_MS
  );
  
  console.log(`Retrying MongoDB connection in ${retryDelay/1000} seconds... (Attempt ${retryCount + 1}/${SERVER.MONGODB.MAX_RETRY_ATTEMPTS})`);
  
  return new Promise(resolve => {
    setTimeout(async () => {
      try {
        const connectionInstance = await mongoose.connect(ENV.MONGODB_URI, connectionOptions);
        
        // Singleton pattern enforcement
        if (!isConnected) {
          console.log(`\nMongo DB reconnected!! DB HOST :: ${connectionInstance.connection.host}`); // LOG
          isConnected = true;
        }
        
        resolve(connectionInstance);
      } catch (error) {
        console.error(`MongoDB connection retry failed: ${error.message}`);
        resolve(await reconnectWithRetry(retryCount + 1));
      }
    }, retryDelay);
  });
};

export { ConnectDB };