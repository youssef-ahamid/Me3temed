import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";

//Models
import User from "../models/User.js";

import { PasswordValidation, EmailValidation } from "../helper/validate.js";
import { findUserByEmail, e, s, tryCatch, genToken } from "../helper/utils.js";

// Register a new user with email and password
router.post("/password", (req, res) => {
  const { email, password, name, img, meta, app } = req.body;

  // Validate
  let errors = [PasswordValidation(password), EmailValidation(email)].filter(
    (e) => !!e // remove null errors
  );
  if (errors.length > 0) return e(400, "Invalid entries!", res, { errors });
  else {
    tryCatch(async () => {
      const passwordHash = await bcrypt.hash(password, 10);

      // Check if user exists
      let user = await findUserByEmail(email);

      if (!!user && !!user.passwordHash) {
        // if user has password
        const validPass = await user.checkPass(password); // check if password is correct
        if (!validPass) return e(409, "User already exists!", res, { id: user._id }); // if wrong password, this is not the user
      } else if (!!user) user.passwordHash = passwordHash;
      else {
        // Create user
        user = new User({
          email,
          passwordHash,
          name,
          img,
          meta,
        });
      }

      user = await user.save();
      const data = await user.login();

      s("User created!", data, res);
    }, res);
  }
});

// Register a new passwordless user
router.post("/passwordless", (req, res) => {
  const { email, name, img, meta, app } = req.body;

  // Validate
  let errors = [EmailValidation(email)].filter(
    (e) => !!e // remove null errors
  );
  if (errors.length > 0) return e(400, "Invalid entries!", res, { errors });
  else {
    tryCatch(async () => {
      // Check if user exists
      let user = await findUserByEmail(email);
      let token = await genToken({ email }, 60 * 60 * 24 * 3);

      // if (!!user && user.apps.includes(app)) return e(409, "User already exists on this app!", res);
      if (!user) {
        // Create user
        user = new User({
          email,
          name,
          img,
          meta,
          apps: [],
        });

        user.apps = [app];
        user = await user.save();
        s("User created!", { user: user._doc, token }, res);
      } else {
        if (!!app) user.apps.push(app);
        user = await user.save();
        s(`User joined app ${app}!`, { user: user._doc }, res);
      }
    }, res);
  }
});

export default router;
