const User = require("../models/user");

exports.postLogin = (req, res) => {
  const { email } = req.body;
  User.findOne({ where: { email: email } })
    .then((user) => {
      req.session.userId = user.email;
      req.session.username = user.name;

      res.status(200).send({
        message: "User logged in successfully!!",
        username: user.name,
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Unable to delete session" });
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
