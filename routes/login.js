import express from "express";
const router = express.Router();

import mongoose from "mongoose";

import verifyTempToken from "./../middleware/temptoken.js";
import verifyBaseToken from "./../middleware/basetoken.js";

import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

// helpers
import {
  findUserByEmail,
  e,
  s,
  tryCatch,
  createSocialLogin,
} from "../helper/utils.js";
import zaagel from "../zaagel.js";

import { encodeURI } from "../helper/utils.js";
import passport from "../helper/passport.js";

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);
router.get(
  "/facebook-callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  async function (req, res) {
    // Successful authentication, redirect home.
    await createSocialLogin("facebook", req.user.facebookUser, res);
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google-callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async function (req, res) {
    // Successful authentication, upsert user
    await createSocialLogin("google", req.user.googleUser, res);
  }
);

router.get("/", function (req, res, next) {
  res.render("login", {
    signInOptions: ["google", "facebook"],
  });
});

router.get("/magic-link", function (req, res, next) {
  res.render("loginWithLink");
});

// Verify token in link and login.
router.get("/link", verifyBaseToken, async (req, res, next) => {
  const email = req.decoded_email;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found`, res);
  else {
    const data = await user.login();
    res.header("x-access-token", data.token);
    res.redirect(`${req.query.redirect_url}?token=${data.token}`);
  }
});

// send a link to login to a user's email
router.post("/link", async (req, res, next) => {
  const { email, redirect_url } = req.body;

  if (!email || !redirect_url)
    return e(
      400,
      `
        Missing fields!
        required: email, redirect_url
      `,
      res
    );

  const user = await findUserByEmail(email);
  if (!user)
    return e(
      400,
      `user with email ${email} not found. please register instead.`,
      res
    );

  const token = jwt.sign({ email: email }, process.env.APISECRETKEY, {
    expiresIn: 3600 * 24 * 30, // 30 days
  });

  const link = `http://localhost:8000/login/link?token=${token}&redirect_url=${redirect_url}`;
  zaagel.mail({
    to: email,
    subject: "Log in with link",
    template: "login-link",
    data: { link },
  });

  return s(`Log in link sent to ${email}`, {}, res);
});

// Verify password and login.
router.post("/password", async (req, res, next) => {
  const { password, email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found`, res);
  else
    await tryCatch(async () => {
      const validPass = await user.checkPass(password);
      if (!validPass) e(401, "The password is incorrect!", res);
      else {
        const data = await user.login();
        s("Log in successful!", data, res);
      }
    }, res);
});

// Verify OTP and login.
router.post("/otp", verifyTempToken, async (req, res, next) => {
  const { otp } = req.body;
  const email = req.decoded_email;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found`, res);
  else
    await tryCatch(async () => {
      const validOTP = await user.checkOTP(otp);
      if (!validOTP) e(401, "Incorrect OTP!", res);
      else {
        const data = await user.login();
        if (!user.isEmailVerified) await user.verifyEmail();
        s("Log in successful!", data, res);
      }
    }, res);
});

export default router;
