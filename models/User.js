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
});

UserSchema.methods.login = async function () {
  const token = jwt.sign({ email: this.email }, process.env.APISECRETKEY, {
    expiresIn: 86400 * 30, // This token expires 30 days later.
  });

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

export default mongoose.model("user", UserSchema);
