import express from "express";
const router = express.Router();

import bcrypt from "bcryptjs";

//Models
import UserObject from "../models/User.js";
import zaagel from "zaagel";
import { s } from "../helper/utils.js";

// Get OTP
router.post("/", async (req, res, next) => {
  const { email, support } = req.body;

  // Generate an OTP
  const num = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  const otp = num.toString();

  // Get hash and save to the database.
  const hash = await bcrypt.hash(otp, 10);

  const user = await UserObject.updateOne(
    { email },
    { email, otp: hash },
    { upsert: true }
  );

  zaagel.mail({
    to: email,
    subject: otp + " is your one time password.",
    template: "OTP",
    data: {
      otp,
      support,
    },
  });

  const token = user.genToken();
  s(`OTP email sent to ${email}`, { token }, res);
});

export default router;
