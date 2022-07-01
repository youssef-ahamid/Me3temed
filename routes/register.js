import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";

//Models
import User from "../models/User.js";

import { PasswordValidation, EmailValidation } from "../helper/validate.js";
import { findUserByEmail, e, s, tryCatch } from "../helper/utils.js";

// Register a new user
router.post("/", (req, res) => {
  const { email, password, name, img, meta, app } = req.body;

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
      const userWithApp = await savedUser.addApp(app);
      s("User created!", { user: userWithApp._doc }, res);
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
      // if (!!user && user.apps.includes(app)) return e(409, "User already exists on this app!", res);
      if (!user) {
        // Create user
        user = new User({
          email,
          name,
          img,
          meta,
          apps: []
        });

        user.apps = [app]
        user = await user.save();
        s("User created!", { user: user._doc }, res);
      } else {
        user.apps.push(app)
        user = await user.save()
        s(`User joined app ${app}!`, { user: user._doc }, res);
      }
    }, res);
  }
});

export default router;
