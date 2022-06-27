import express from "express";
const router = express.Router();

import verifyBaseToken from "./../middleware/basetoken.js";

// helpers
import { findUserByEmail, e, s, tryCatch } from "../helper/utils.js";
import User from "../models/User.js";
import App from "../models/App.js";
import admin from "../middleware/admin.js";

// delete a user
router.delete("/user/:id", verifyBaseToken, admin, async (req, res) => {
  tryCatch(async () => {
    await User.findByIdAndDelete(req.params.id);
    s("User deleted!", {}, res);
  }, res);
});

// create app
router.post("/app", verifyBaseToken, admin, async (req, res) => {
  const { name, url } = req.body;
  tryCatch(async () => {
    const app = new App({
      name,
      url,
    });
    const savedApp = await app.save();
    s("App created!", { app: savedApp._doc }, res);
  }, res);
});

// update app
router.patch("/app/:id", verifyBaseToken, admin, async (req, res) => {
  const { name, url } = req.body;
  tryCatch(async () => {
    const app = await App.findById(req.params.id);
    app.name = name || app.name;
    app.url = url || app.url;

    const savedApp = await app.save();
    s("App updated!", { app: savedApp._doc }, res);
  }, res);
});

export default router