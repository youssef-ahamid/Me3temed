import express from 'express';
const router = express.Router();

//Models
import BlacklistTokenObject from '../models/Blacklist.js';

// Logout
router.post('/', (req, res, next) => {
    // Add token to the blacklist. 
  const newBlacklistToken = new BlacklistTokenObject({
      email: req.decoded_email,
      token: req.token
  });
  const promise = newBlacklistToken.save();
  promise.then((data) => {
    if(!data){
        res.status(500).json({
            success: false,
            message: "Something went wrong! Try again later!"
        });
    }else{
        res.status(200).json({
            success: true,
            message: "You have been successfully logged out! Good bye!"
        });
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Try again later."
    });
  });
});

export default router;