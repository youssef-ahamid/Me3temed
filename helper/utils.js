import UserObject from "../models/User.js";
import AppObject from "../models/App.js";

/**
 * @description Returns the user with the provided email address
 * @param email String
 * @async
 */
export const findUserByEmail = async (email, populate) => {
  if (!!populate)
    return await UserObject.findOne({ email }).populate(populate).exec();
  else return await UserObject.findOne({ email });
};

/**
 * @description Returns the app with the provided app id
 * @param id String/Int
 * @async
 */
export const getApp = async (id, populate) => {
  console.log(id)
  let apps = await AppObject.find().exec()
  console.log(apps)
  if (!!populate)
    return await AppObject.findById(id).populate(populate).exec();
  else return await AppObject.findById(id);
};

/**
 * @description send an error response
 * @param errorCode 400 - 500 status codes
 * @param message The error message displayed in the response. Defaults to "Something went wrong. Try again later."
 * @param res the response object
 * @param error optional error object to be sent with response.
 */
export function e(
  errorCode,
  message = "Something went wrong. Try again later.",
  res,
  error
) {
  console.error(error);
  res.status(errorCode).json({
    success: false,
    message,
    error,
  });
}

/**
 * @description send a success response
 * @param message The success message displayed in the response. Defaults to "action completed successfully"
 * @param data response data (e.g. user)
 * @param res the response object
 */
export function s(message = "action completed successfully", data = {}, res) {
  res.status(200).json({
    success: true,
    message,
    ...data,
  });
}

/**
 * @async
 * @description try a block of code, catch errors
 * and send them in a response with 500 status
 * (caught errors should always be server errors.
 * Other errors should be handled differently)
 * @param tried function to execute inside the try block
 * @param res the response object
 */
export const tryCatch = async (tried = () => {}, res = {}) => {
  try {
    await tried();
  } catch (err) {
    e(500, "Something Went Wrong. Try Again!", res, err);
  }
};


/**
 * @description Returns the user with the provided email address
 * @param email String
 * @async
 */
 export const createSocialLogin = async (provider, profile, res) => {
   console.log({ provider, profile });
  tryCatch(async () => {
    // Check if user exists
    const user = await findUserByEmail(profile.email);
    if (!!user) {
      const data = await user.addSocialLogin(provider, profile.data);
      if (!!data && data.code === 409)
        s(
          `User already registered this social login. Nothing new happened.`,
          { user },
          res
        );
      else if (profile.isEmailVerified && !user.isEmailVerified)
        await user.verifyEmail();
      s(`User updated! Added a social login from ${provider}`, { user }, res);
    } else {
      // Create user
      const newUser = new UserObject(profile);
      const savedUser = await newUser.save();
      await savedUser.addSocialLogin(provider, profile.data)
      s("User created!", { user: savedUser._doc }, res);
    }
  }, res);
};

export const encodeURI = function(obj, prefix) {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push((v !== null && typeof v === "object") ?
        encodeURI(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}
