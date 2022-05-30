import env from "dotenv";
env.config();

import jwt from "jsonwebtoken";
import BlacklistTokenObject from "../models/Blacklist.js";

import { e, tryCatch } from "../helper/utils.js";

export default async function (req, res, next) {
  const token = req.headers["x-access-token"] || req.body.token || req.query.token;
  if (token) {
    tryCatch(async () => {
      const expired = await BlacklistTokenObject.findOne({ token });  // Check blacklist for token. If it exists, it expired.
      if (expired) e(401, "Expired token!", res);
      else {
        // Verify token.
        jwt.verify(token, process.env.APISECRETKEY, (err, decoded) => {
          if (!!err) e(401, "Failed to authenticate token!", res);
          else {
            if (!decoded.email) e(401, "Failed to authenticate token!", res);
            else {
              req.decoded_email = decoded.email;
              req.token = token;
              next();
            }
          }
        });
      }
    }, res);
  } else e(401, "Forbidden! You have to get a token first!", res);
}
