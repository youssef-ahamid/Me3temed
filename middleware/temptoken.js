import jwt from "jsonwebtoken";
import { e, tryCatch } from "../helper/utils.js";

export default function (req, res, next) {
  const token = req.headers["x-access-token"] || req.body.token || req.query.token;
  if (token) {
    tryCatch(() => {
      // Verify token.
      jwt.verify(token, process.env.TEMPORARILYTOKENKEY, (err, decoded) => {
        if (err) e(401, "Failed to authenticate token!", res);
        else {
          if (!decoded.email) e(401, "Failed to authenticate token!", res);
          else {
            req.decoded_email = decoded.email;
            next();
          }
        }
      });
    });
  } else e(401, "Failed to authenticate token!", res);
}
