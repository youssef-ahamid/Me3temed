import express from "express";
const router = express.Router();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();
//Models
import UserObject from "../models/User.js";
import zaagel from "../zaagel.js";
import { findUserByEmail, s } from "../helper/utils.js";

// Get OTP
router.post("/", async (req, res, next) => {
  let { email, name, app, support } = req.body;
  email = email.toLowerCase()

  // Generate an OTP
  const num = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  const otp = num.toString();

  // Get hash and save to the database.
  const hash = await bcrypt.hash(otp, 10);

  let user = await findUserByEmail(email);
  if (!user) user = new UserObject({ email, name, app });
  user.otp = hash;
  user = await user.save();

  console.log(user)

  zaagel.mail({
    to: email,
    subject: otp + " is your one time password.",
    template: "OTP",
    data: {
      otp,
      support,
    },
  });

  const token = jwt.sign({ email: user.email }, process.env.TEMPORARILYTOKENKEY, {
    expiresIn: 900,
  });
  s(`OTP email sent to ${email}`, { token }, res);
});

export default router;
