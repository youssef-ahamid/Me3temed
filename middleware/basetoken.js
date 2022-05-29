import jwt from "jsonwebtoken";
// init env vairables
import env from "dotenv";
env.config();
import BlacklistTokenObject from "../models/Blacklist.js";

export default function (req, res, next) {
  const token =
    req.headers["x-access-token"] || req.body.token || req.query.token;

  if (token) {
    // Check blacklist for token.
    const promise = BlacklistTokenObject.findOne({
      token,
    });
    promise
      .then((data) => {
        if (data) {
          res.status(401).json({
            status: false,
            message: "Expired token!",
          });
        } else {
          // Verify token.
          jwt.verify(token, process.env.APISECRETKEY, (err, decoded) => {
            if (!!err) {
              res.status(401).json({
                status: false,
                error: err,
                message: "Failed to authenticate token!",
              });
            } else {
              if (!decoded.email) {
                res.status(401).json({
                  status: false,
                  message: "Failed to authenticate token!",
                });
              } else {
                req.decoded_email = decoded.email;
                req.token = token;
                next();
              }
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          status: false,
          error: err,
          message: "An error occured. Try again later.",
        });
      });
  } else {
    res.status(401).json({
      status: false,
      message: "Forbidden! You have to get token!",
    });
  }
}
