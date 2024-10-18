const { body, check } = require("express-validator");
const colorsList = require("./colorsList");

const validateProduct = [
  check("title").notEmpty().withMessage("Title cannot be empty string"),
  body("description")
    .isLength({ min: 20 })
    .withMessage("Description should be 20 characters long"),
  body("category")
    .custom((value) => /[a-zA-Z]{3}/.test(value) && !/\d/.test(value))
    .withMessage(
      "Category should contain only alphabets and length must be atleast 3"
    ),
  body("color")
    .custom((value) => {
      const colorValue = value.toLowerCase();
      if (colorsList.find((color) => color.toLowerCase() === colorValue)) {
        return true;
      }
      return false;
    })
    .withMessage("Not a valid color name."),
  check("price")
    .notEmpty()
    .withMessage("Price cannot be blank")
    .isInt({ min: 1 })
    .withMessage("Price cannot be 0 or negative"),
];

module.exports = validateProduct;
