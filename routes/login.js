import express from "express";
const router = express.Router();

import verifyTempToken from "./../middleware/temptoken.js";
import verifyBaseToken from "./../middleware/basetoken.js";

// helpers
import { findUserByEmail, e, s, tryCatch } from "../helper/utils.js";
import zaagel from "zaagel";

import passport from "passport";
import oauth20 from "passport-google-oauth20";

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { email: user.email, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const GoogleStrategy = oauth20.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1086286750475-gqq1jk1jdepfkjbhronp81omr04g0cq0.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/login/google-callback/",
    },
    function (accessToken, refreshToken, profile, cb) {
      const { name, emails, displayName, photos } = profile;
      const googleUser = {
        email: emails[0].value,
        isEmailVerified: emails[0].verified,
        name: displayName,
        img: photos[0].value,
        data: { names: name },
        refreshToken,
      };
      return cb(null, { googleUser, accessToken });
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google-callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async function (req, res) {
    // Successful authentication, upsert user
    const { googleUser } = req.user;
    const origin = "google";

    tryCatch(async () => {
      // Check if user exists
      const user = await findUserByEmail(googleUser.email);
      if (!!user) {
        if (
          !!user.meta &&
          !!user.meta.socials &&
          user.meta.socials.map((social) => social.from).includes(origin)
        )
          s(
            `User already registered this social login. Nothing new happened.`,
            { user },
            res
          );
        else {
          await user.addSocialLogin(origin, googleUser.data);
          if (googleUser.isEmailVerified && !user.isEmailVerified)
            await user.verifyEmail();
          s(`User updated! Added a social login from ${origin}`, { user }, res);
        }
      } else {
        // Create user
        const newUser = new User(googleUser);
        const savedUser = await newUser.save();
        s("User created!", { user: savedUser._doc }, res);
      }
    }, res);
    // res.send("/success");
  }
);

router.get("/", function (req, res, next) {
  res.render("login", {
    signInOptions: ["google"],
  });
});

// Verify token in link and login.
router.get("/link", verifyBaseToken, async (req, res, next) => {
  const email = req.decoded_email;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found`, res);
  else {
    const data = await user.login();
    s("Log in successful!", data, res);
  }
});

// send a link to login to a user's email
router.post("/link", async (req, res, next) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user)
    e(400, `user with email ${email} not found. please register instead.`, res);
  else {
    const token = user.genToken();
    const link = `http://localhost:8000/login/link?token=${token}`;
    zaagel.mail({
      to: email,
      subject: "Log in with link",
      template: "login-link",
      data: { link },
    });
    const data = await user.login();
    s("Log in successful!", data, res);
  }
});

// Verify password and login.
router.post("/password", async (req, res, next) => {
  const { password, email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found`, res);
  else
    await tryCatch(async () => {
      const validPass = await user.checkPass(password);
      if (!validPass) e(401, "The password is incorrect!", res);
      else {
        const data = await user.login();
        s("Log in successful!", data, res);
      }
    }, res);
});

// Verify OTP and login.
router.post("/otp", verifyTempToken, async (req, res, next) => {
  const { otp } = req.body;
  const email = req.decoded_email;
  const user = await findUserByEmail(email);
  if (!user) e(400, `user with email ${email} not found`, res);
  else
    await tryCatch(async () => {
      const validOTP = await user.checkOTP(otp);
      if (!validOTP) e(401, "Incorrect OTP!", res);
      else {
        const data = await user.login();
        if (!user.isEmailVerified) await user.verifyEmail();
        s("Log in successful!", data, res);
      }
    }, res);
});

export default router;
