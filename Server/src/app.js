import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.config.js";
import { SERVER } from "./constants.js";

const app = express();

const corsOptions = {
  // origin: function (origin, callback) {
  //   if (ENV.CLIENT_CORS_ORIGIN.includes(origin)) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: SERVER.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: SERVER.JSON_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// routes imports with custom alias
import {router as authRoute} from './routes/auth.route.js'

app.use("/api/v1/auth", authRoute)

export { app };
