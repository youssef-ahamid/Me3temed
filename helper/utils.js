import UserObject from "../models/User.js";
/**
 * @description Returns the user with the provided email address
 * @param email String
 * @async
 */
export const findUserByEmail = async (email) => {
  return await UserObject.findOne({ email });
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
