const express = require("express");

const router = express.Router();

const authControllers = require("../controllers/auth");

router.post("/login", authControllers.postLogin);
router.post("/logout", authControllers.postLogout);
router.post("/signup", authControllers.postSignup);
router.get("/csrfToken", (req, res) => {
  const token = req.csrfToken();
  res.status(200).send({
    CSRFToken: token,
  });
});

module.exports = router;
