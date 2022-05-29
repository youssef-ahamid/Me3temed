import express from "express";
import { s } from "../helper/response.js";
import { tryCatch } from "../helper/utils.js";
import verifyBaseToken from "../middleware/basetoken.js";
const router = express.Router();

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
    const blacklisted = await newBlacklistToken.save();
    s("Logout successful!", {}, res);
  }, res);
});

export default router;
