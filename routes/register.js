import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";

//Models
import User from "../models/User.js";

import { PasswordValidation, EmailValidation } from "../helper/validate.js";
import { e, s } from "../helper/response.js";
import { findUserByEmail, tryCatch } from "../helper/utils.js";

// Register a new user User
router.post("/", (req, res) => {
  const { email, password, name, img } = req.body;

  // Validate
  let errors = [PasswordValidation(password), EmailValidation(email)].filter(
    (e) => !!e // remove null errors
  );
  if (errors.length > 0) return e(400, "Invalid entries!", res, { errors });
  else {
    tryCatch(async () => {
      // Check if user exists
      const user = await findUserByEmail(email);
      if (!!user) return e(409, "User already exists!", res);

      // Create user
      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = new User({
        email,
        passwordHash,
        name,
        img,
      });
      const savedUser = await newUser.save();
      s("User created!", { user: savedUser._doc }, res);
    }, res);
  }
});

export default router;
