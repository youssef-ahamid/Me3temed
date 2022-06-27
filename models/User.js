import mongoose from "mongoose";
const Schema = mongoose.Schema;
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getApp } from "../helper/utils.js";


const UserSchema = new Schema({
  email: { type: String, unique: true },
  refreshToken: String,
  name: String,
  isEmailVerified: { type: Boolean, default: false },
  meta: Object,
  img: String,
  role: { type: String, default: "user" },
  passwordHash: String,
  otp: { type: String },
  lastLoggedIn: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  apps: [{ type: mongoose.Types.ObjectId, ref: "App" }],
});

UserSchema.methods.genToken = async function (time = 900) {
  return jwt.sign({ email: this.email }, process.env.APISECRETKEY, {
    expiresIn: time,
  });
};

UserSchema.methods.login = async function () {
  const token = jwt.sign({ email: this.email }, process.env.APISECRETKEY, {
    expiresIn: 86400 * 30,
  });

  // update last login timestamp
  this.lastLoggedIn = new Date();
  await this.save();

  return { token, user: this };
};

UserSchema.methods.checkPass = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.addApp = async function (appId) {
  appId = mongoose.Types.ObjectId(appId)
  const app = await getApp(appId);
  console.log({app, appId})
  if (!app) return
  else if (this.apps.includes(appId)) return app
  else {
    this.apps.push(appId);
    app.users.push(this._id);
  
    await this.save();
    const savedApp = await app.save();
    return savedApp;
  }
};

UserSchema.methods.checkOTP = async function (otp) {
  return await bcrypt.compare(otp, this.otp);
};

UserSchema.methods.verifyEmail = async function () {
  this.isEmailVerified = true;
  await this.save();
};

UserSchema.methods.addSocialLogin = async function (from, data) {
  if (!this.meta) this.meta = { socials: [] };
  else if (!this.meta.socials || !this.meta.socials.length)
    this.meta.socials = [];
  else if (this.meta.socials.map((social) => social.from).includes(from))
    return { code: 409, message: 'already registered this social login' };
  this.meta.socials.push({ from, data });
  await this.save();
};

export default mongoose.model("User", UserSchema);
