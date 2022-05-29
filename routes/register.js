import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";

//Models
import UserObject from "../models/User.js";

import {
  validate,
  required,
  isEmail,
  hasDigit,
  hasLowerCase,
  hasUpperCase,
  hasSpecialCharacter,
} from "../helper/validate.js";

// Create User
router.post("/", (req, res) => {
  const { email, password, name, img } = req.body;

  let errors = [
    validate(
      "password",
      password,
      required,
      hasLowerCase,
      hasDigit,
      hasUpperCase,
      hasSpecialCharacter
    ),
    validate("email", email, required, isEmail),
  ].filter((e) => !!e);

  if (errors.length > 0)
    return res.status(400).json({
      success: false,
      message: "Invalid entries!",
      errors,
    });
  else {
    UserObject.find({ email: email }, function (err, existingUser) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err,
          message: "Something went wrong. Try again!",
        });
      } else {
        if (!!existingUser && existingUser.length > 0) {
          res.status(409).json({
            success: false,
            message: "User already exists.",
          });
        } else {
          bcrypt.hash(password, 10, function (err, passwordHash) {
            // Store hash in your password DB.
            UserObject.create(
              {
                email,
                name,
                img,
                passwordHash,
              },
              function (err, user) {
                if (err) {
                  res.status(500).json({
                    success: false,
                    error: err,
                    message: "Something went wrong. Try again!",
                  });
                } else {
                  res.status(201).json({
                    success: true,
                    user,
                    message: "User created successfully.",
                  });
                }
              }
            );
          });
        }
      }
    });
  }
});

export default router;
