const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found!!" });
      }

      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.username = user.name;
          req.session.userId = user.email;

          res.status(200).send({
            message: "User logged in successfully!!",
            username: user.name,
          });
        } else {
          res.status(400).send({ message: "Password does not match!!" });
        }
      });
    })
    .catch((err) => res.status(500).send({ message: "Unable to login" }));
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Unable to logout user" });
    }
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: false,
    });
    res.status(200).send({
      message: "User logged out successfully!!",
    });
  });
};

exports.postSignup = (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        return res
          .status(409)
          .send({ message: "User with this email already exists!" });
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = User.build({
            name: username,
            email: email,
            password: hashedPassword,
          });
          return user.save();
        })
        .then(() => {
          res.status(200).send({ message: "User registered successfully!!" });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: "Unable to register user" });
    });
};
