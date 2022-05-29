export function required(value, cb) {
  if (!value) cb("Can't be empty!");
  else if (typeof value === "string" && !Boolean(value.trim()))
    cb("Can't contain whitespace only!");
}

export function isEmail(value, cb) {
  var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!value.match(emailformat)) cb("Must be in email format!");
}

export function minCharacters(value, min, cb) {
  if (value.length < min) cb(`Can't be less than ${min} characters long!`);
}

export function maxCharacters(value, max, cb) {
  if (value.length > max) cb(`Can't be greater than ${max} characters long!`);
}

export function hasUpperCase(value, cb) {
  for (const char of value) if (char.match(/[a-z]/i) && char == char.toUpperCase()) return;
  cb("Must contain at least one uppercase letter!");
}

export function hasLowerCase(value, cb) {
  for (const char of value) if (char.match(/[a-z]/i) && char == char.toLowerCase()) return;
  cb("Must contain at least one lowercase letter!");
}

export function hasDigit(value, cb) {
  if (!/\d/.test(value)) cb("Must contain at least one number!");
}

export function hasSpecialCharacter(value, cb) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!specialChars.test(value))
    cb("Must contain at least one special character!");
}

export function validate(name, value, ...validations) {
  let errors = {};
  let errorFound = false;
  console.log(validations);
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
