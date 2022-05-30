
// -----------------Init App----------------- //
import express from "express";
const app = express();

import expressLiquid from 'express-liquid'; // use liquid as
app.set('view engine', 'liquid');           // the templating engine
app.engine('liquid', expressLiquid());
app.use(expressLiquid.middleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Me3temed live on port ${PORT}`);
});

// db connection
import db from "./helper/db.js"; 
db.on("open", () => {
  console.log("MongoDB Connected...");
});

// environment vairables
import env from "dotenv";
env.config();

// ----------------Middleware---------------- //
import cors from "cors";
app.use(cors({ origin: "*" }));

import logger from "morgan";
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import cookieParser from "cookie-parser";
app.use(cookieParser());

// ------------------Routes------------------ //
import OTPRouter from './routes/otp.js';
app.use("/otp", OTPRouter);

import registerRouter from './routes/register.js';
app.use("/register", registerRouter);

import loginRouter from './routes/login.js';
app.use("/login", loginRouter);

import logoutRouter from './routes/logout.js';
app.use("/logout", logoutRouter);

import socialRouter from './routes/social.js';
app.use("/social", socialRouter);


export default app;
