
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

import session from "express-session";
app.use(session({
  secret: 'keyboard dog named feeno',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 365 * 1000
  }
}));

import passport from "passport";
app.use(passport.authenticate('session'));

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

import passwordRouter from './routes/password.js';
app.use("/password", passwordRouter);

import logoutRouter from './routes/logout.js';
app.use("/logout", logoutRouter);

import socialRouter from './routes/social.js';
app.use("/social", socialRouter);

import adminRouter from './routes/admin.js';
app.use("/admin", adminRouter);


export default app;
