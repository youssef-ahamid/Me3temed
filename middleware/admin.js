import { e, findUserByEmail } from "../helper/utils.js";

export default async function (req, res, next) {
  const email = req.decoded_email;
  const user = await findUserByEmail(email);
  if (!user || user.role != "admin") e(401, `Insufficient access rights!`, res);
  else {
    req.admin = user;
    next();
  }
}
