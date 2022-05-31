import mongoose from "mongoose";
const Schema = mongoose.Schema;
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  email: { type: String, unique: true },
  refreshToken: String,
  name: String,
  isEmailVerified: { type: Boolean, default: false },
  meta: Object,
  img: String,
  passwordHash: { type: String },
  otp: { type: String },
  lastLoggedIn: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  apps: [{ type: mongoose.Types.ObjectId, ref: "App", scoped: Object }]
});

UserSchema.methods.genToken = async function (time = 900) {
  return jwt.sign({ email: this.email }, process.env.APISECRETKEY, { expiresIn: time });
}

UserSchema.methods.login = async function () {
  const token = this.genToken(86400 * 30) // this token expires 30 days later

  // update last login timestamp
  this.lastLoggedIn = new Date();
  await this.save();

  return { token, user: this };
};

UserSchema.methods.checkPass = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.checkOTP = async function (otp) {
  return await bcrypt.compare(otp, this.otp);
};

UserSchema.methods.verifyEmail = async function () {
    this.isEmailVerified = true;
    await this.save();
};

UserSchema.methods.addSocialLogin = async function (from, data) {
    if (!this.meta) this.meta = { socials: [] }
    else if(!this.meta.socials || !this.meta.socials.length) this.meta.socials = [];

    console.log(this.meta)

    this.meta.socials.push({ from, data });
    await this.save();
};

export default mongoose.model("User", UserSchema);
