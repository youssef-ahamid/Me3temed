import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";

//Models
import User from "../models/User.js";

import { PasswordValidation, EmailValidation } from "../helper/validate.js";
import { findUserByEmail, e, s, tryCatch } from "../helper/utils.js";

// Register a new user
router.post("/", (req, res) => {
  const { email, password, name, img, meta } = req.body;

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
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        passwordHash,
        name,
        img,
        meta,
      });
      const savedUser = await newUser.save();
      s("User created!", { user: savedUser._doc }, res);
    }, res);
  }
});

// Register a new passwordless user
router.post("/", (req, res) => {
  const { email, name, img, meta } = req.body;

  // Validate
  let errors = [EmailValidation(email)].filter(
    (e) => !!e // remove null errors
  );
  if (errors.length > 0) return e(400, "Invalid entries!", res, { errors });
  else {
    tryCatch(async () => {
      // Check if user exists
      const user = await findUserByEmail(email);
      if (!!user) return e(409, "User already exists!", res);

      // Create user
      const newUser = new User({
        email,
        name,
        img,
        meta,
      });
      const savedUser = await newUser.save();
      s("User created!", { user: savedUser._doc }, res);
    }, res);
  }
});

// Register a new user from social login
router.post("/social", (req, res) => {
  const { email, name, img, isEmailVerified, origin, data } = req.body;

  tryCatch(async () => {
    // Check if user exists
    const user = await findUserByEmail(email);
    if (!!user) {
      if (
        !!user.meta.socials &&
        user.meta.socials.map((social) => social.from).includes(origin)
      )
        s(
          `User already registered this social login. Nothing new happened.`,
          { user },
          res
        );
      else {
        await user.addSocialLogin(origin, data);
        if (isEmailVerified && !user.isEmailVerified) await user.verifyEmail;
        s(`User updated! Added a social login from ${origin}`, { user }, res);
      }
    } else {
      // Create user
      const newUser = new User({
        email,
        isEmailVerified,
        name,
        img,
      });
      const savedUser = await newUser.save();
      s("User created!", { user: savedUser._doc }, res);
    }
  }, res);
});

export default router;
