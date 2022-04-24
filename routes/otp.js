import express from "express";
const router = express.Router();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

//Models
import UserObject from "../models/User.js";

// Get OTP
router.post("/", (req, res, next) => {
  const { email, support } = req.body;

  // Generate an OTP
  const num = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  const otp = num.toString();

  // Get hash and save to the database.
  bcrypt.hash(otp, 10).then((hash) => {
    const promise = UserObject.updateOne(
      {
        email,
      },
      {
        email: email,
        otp: hash,
      },
      {
        upsert: true,
      }
    );
    promise
      .then((data) => {
        let message = {
          to: email,
          subject: otp + " is your one time password.",
          template: 'OTP',
          data: {
            otp,
            support
          }
        };
        fetch(`https://zaagel.samuraisoftware.house/mail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify(message),
        }).then(() => {
          console.log("otp:" + otp);

          // Prepare a token.
          const payload = {
            email,
          };
          const token = jwt.sign(payload, process.env.TEMPORARILYTOKENKEY, {
            expiresIn: 900, // This token expires 15 minutes later.
          });

          // Send a response.
          res.status(200).json({
            success: true,
            message: "If your address is correct, you will receive an email!",
            token: token,
            //otp: otp
            // The above line is added for the test. Uncomment it, when testing.
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Something went wrong. Try again later.",
        });
      });
  });
});

export default router;
