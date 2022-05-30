import express from "express";
const router = express.Router();

import { getDecodedOAuthJwtGoogle } from '../helper/decoder.js'
router.get("/google", (req, res) => {
  res.render("google", {
    client_id:
      "329595816510-17gcc14mlp125mpoljtmpc7tqup8oa5c.apps.googleusercontent.com",
    decode: getDecodedOAuthJwtGoogle
  });
});

export default router;
