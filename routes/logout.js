import express from "express";
const router = express.Router();

import { s, tryCatch } from "../helper/utils.js";
import verifyBaseToken from "../middleware/basetoken.js";

//Models
import BlacklistTokenObject from "../models/Blacklist.js";

// Logout
router.post("/", verifyBaseToken, (req, res, next) => {
  tryCatch(async () => {
    // Add token to the blacklist.
    const newBlacklistToken = new BlacklistTokenObject({
      email: req.decoded_email,
      token: req.token,
    });
    await newBlacklistToken.save();
    s("Logout successful!", {}, res);
  }, res);
});

export default router;
