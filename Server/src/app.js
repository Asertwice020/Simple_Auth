import cors from "cors";
import express from "express";
import passport from "passport";
import session from 'express-session'
import cookieParser from "cookie-parser";
import { SERVER } from "./constants.js";
import { ENV } from "./config/env.config.js";
import {corsOptions} from './config/cors.config.js'
import { configurePassport } from "./config/passport.config.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { loggerMiddleware, errorLoggerMiddleware } from "./middlewares/logger.middleware.js";

const app = express();

app.use(cors(corsOptions));
app.use(loggerMiddleware);
app.use(express.json({ limit: SERVER.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: SERVER.JSON_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// * Initialize session
app.use(session({
  secret: ENV.ACCESS_TOKEN_JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: ENV.NODE_ENV === 'production',
    maxAge: SERVER.TOKENS.ACCESS_TOKEN.COOKIE_EXPIRY_MS
  }
}));

// * Initialize passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// * routes imports with custom alias
import {router as authRoute} from './routes/auth.route.js'
import { router as testRoute } from './routes/test.route.js'

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/test", testRoute)

// * ERROR HANDLER MIDDLEWARES
app.use(errorLoggerMiddleware);
app.use(errorHandler);

export { app };
