const express = require("express");
const { check, body } = require("express-validator");

const router = express.Router();

const authControllers = require("../controllers/auth");
const validateSignup = require("../validation/signupValidation");

router.post(
  "/login",
  check("email").isEmail().withMessage("Not a valid email address"),
  authControllers.postLogin
);

router.post("/logout", authControllers.postLogout);

router.post("/signup", validateSignup, authControllers.postSignup);

router.get("/csrfToken", (req, res) => {
  const token = req.csrfToken();
  res.status(200).send({
    CSRFToken: token,
  });
});

router.post("/reset-password", authControllers.postResetPassword);
router.post("/change-password/:resetToken", authControllers.changePassword);

module.exports = router;
