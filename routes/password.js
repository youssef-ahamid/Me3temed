import express from "express";
const router = express.Router();

import verifyBaseToken from "./../middleware/basetoken.js";

import env from "dotenv";
env.config();

// helpers
import { findUserByEmail, e, s, tryCatch } from "../helper/utils.js";
import bcrypt from "bcryptjs";

router.post("/update", verifyBaseToken, async (req, res) => {
  const email = req.decoded_email;
  tryCatch(async () => {
    let user = await findUserByEmail(email);
    if (!user) e(400, `user with email ${email} not found`, res);
    else {
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      user.passwordHash = passwordHash;
      user = await user.save();

      const data = await user.login();
      s("Password updated successfully", data, res);
    }
  }, res);
});

export default router;

