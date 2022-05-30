/**
 * @description assert that this field's value exists
 * @param value field value
 * @param cb callback function with error message (iff error)
 */
export function required(value, cb) {
  if (!value) cb("Can't be empty!");
  else if (typeof value === "string" && !Boolean(value.trim()))
    cb("Can't contain whitespace only!");
}

/**
 * @description assert that this field's value is an email
 * @param value field value
 * @param cb callback function with error message (iff error)
 */
export function isEmail(value, cb) {
  var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!value.match(emailformat)) cb("Must be in email format!");
}

/**
 * @description assert that this field's value has a minimum length
 * @param value field value
 * @param min minimum length of value
 * @param cb callback function with error message (iff error)
 */
export function minCharacters(value, min, cb) {
  if (value.length < min) cb(`Can't be less than ${min} characters long!`);
}

/**
 * @description assert that this field's value has a maximum length
 * @param value field value
 * @param min maximum length of value
 * @param cb callback function with error message (iff error)
 */
export function maxCharacters(value, max, cb) {
  if (value.length > max) cb(`Can't be greater than ${max} characters long!`);
}

/**
 * @description assert that this field's value has at least one uppercase letter
 * @param value field value
 * @param cb callback function with error message (iff error)
 */
export function hasUpperCase(value, cb) {
  for (const char of value) if (char.match(/[a-z]/i) && char == char.toUpperCase()) return;
  cb("Must contain at least one uppercase letter!");
}

/**
 * @description assert that this field's value has at least one lowercase letter
 * @param value field value
 * @param cb callback function with error message (iff error)
 */
export function hasLowerCase(value, cb) {
  for (const char of value) if (char.match(/[a-z]/i) && char == char.toLowerCase()) return;
  cb("Must contain at least one lowercase letter!");
}

/**
 * @description assert that this field's value has at least one numeric character
 * @param value field value
 * @param cb callback function with error message (iff error)
 */
export function hasDigit(value, cb) {
  if (!/\d/.test(value)) cb("Must contain at least one number!");
}

/**
 * @description assert that this field's value has at least one special letter
 * @param value field value
 * @param cb callback function with error message (iff error)
 */
export function hasSpecialCharacter(value, cb) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!specialChars.test(value))
    cb("Must contain at least one special character!");
}

/**
 * @description Checks to see if password is valid
 * @param value field value
 * @validation required
 * @validation hasDigit
 * @validation hasLowerCase
 * @validation hasUpperCase
 * @validation hasSpecialCharacter
 */
export const PasswordValidation = (value) => {
  return validate(
    "password",
    value,
    required,
    hasLowerCase,
    hasDigit,
    hasUpperCase,
    hasSpecialCharacter
  )
}

/**
 * @description Checks to see if email is valid
 * @param value field value
 * @validation required
 * @validation isEmail
 */
export const EmailValidation = (value) => {
  return validate("email", value, required, isEmail)
}

/**
 * @description run validations
 * @param name field's name (e.g. "email")
 * @param value field value (e.g. "<your-name>@<domain>.com")
 * @param validations validations to run
 * @avaliable_validations 
 * @validation required
 * @validation isEmail
 * @validation minCharacters
 * @validation maxCharacters
 * @validation hasDigit
 * @validation hasLowerCase
 * @validation hasUpperCase
 * @validation hasSpecialCharacter
 */
export function validate(name, value, ...validations) {
  let errors = {};
  let errorFound = false;
  for (let i = 0; i < validations.length; i++) {
    if (!errorFound)
      validations[i](value, (err) => {
        if (err) {
          errors[name] = err;
          errorFound = true;
        }
      });
  }
  if (errorFound)
    return errors;
}
