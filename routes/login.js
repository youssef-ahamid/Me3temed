import express from "express";
const router = express.Router();

import verifyTempToken from "./../middleware/temptoken.js";
import verifyBaseToken from "./../middleware/basetoken.js";

// helpers
import { findUserByEmail, e, s, tryCatch } from "../helper/utils.js";
import zaagel from "zaagel";

// Verify token and login.
router.post("/", verifyBaseToken, async (req, res, next) => {
  const email = req.decoded_email;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found`, res);
  else {
    const data = await user.login();
    s("Log in successful!", data, res);
  }
});

// Verify token in link and login.
router.get("/link", verifyBaseToken, async (req, res, next) => {
  const email = req.decoded_email;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found`, res);
  else {
    const data = await user.login();
    s("Log in successful!", data, res);
  }
});

// send a link to login to a user's email
router.post("/link", async (req, res, next) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found. please register instead.`, res);
  else {
    const token = user.genToken();
    const link = `http://localhost:8000/login/link?token=${token}`
    zaagel.mail({
      to: email,
      subject: "Log in with link",
      template: "login-link",
      data: { link }
    })
    const data = await user.login();
    s("Log in successful!", data, res);
  }
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
        if(!user.isEmailVerified) await user.verifyEmail();
        s("Log in successful!", data, res);
      }
    }, res);
});

export default router;
