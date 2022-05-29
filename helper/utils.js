import UserObject from "../models/User.js";
export const findUserByEmail = async (email) => {
  return await UserObject.findOne({ email });
};

import { e } from './response.js'
export const tryCatch = async (tried, res) => {
  try {
    await tried();
  } catch (err) {
    e(500, "Something Went Wrong. Try Again!", res, err);
  }
};
