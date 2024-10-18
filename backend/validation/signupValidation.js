const { body, check } = require("express-validator");

const validateSignup = [
  body("username")
    .custom((value) => /[a-zA-Z]{3}\d+[a-zA-Z0-9]+/.test(value))
    .withMessage(
      "Username should begin with alphabet & only numbers and alphabets are accepted"
    ),

  check("email").isEmail().withMessage("Not a valid email address"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Minimum password length is 8"),

  // body("password")
  //   .custom((value) => {
  //     if (
  //       /[a-z]+/.test(value) &&
  //       /\d+/.test(value) &&
  //       /[A-Z]+/.test(value) &&
  //       /[-_#$@!=]+/.test(value)
  //     ) {
  //       return true;
  //     }
  //     return false;
  //   })
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must contain atleast 1 uppercase alphabet, 1 lowercase alphabet, 1 special character & 1 numeric"
    ),

  body("confirmpass")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Entered passwords don't match"),
];

module.exports = validateSignup;
