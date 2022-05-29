
// -----------------Init App----------------- //
import express from "express";
const app = express();
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

app.get("/", (req, res) => {
  res.send("Me3temed");
});

export default app;
