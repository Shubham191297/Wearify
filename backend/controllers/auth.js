const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const cookie = require("cookie");
const { Op } = require("sequelize");
const nodeMailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const secretKey = require("../utils/secretKey");
const SendGrid_API_Key = require("../utils/sendgridSecretKey");
const { localFrontend } = require("../utils/serverURL");

const transporter = nodeMailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SendGrid_API_Key,
    },
  })
);

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  const result = validationResult(req);

  if (result.errors.length > 0) {
    res.status(400).send({
      message: result.errors[0].msg,
      inputName: result.errors[0].path,
    });
  } else {
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User not found!!" });
        }

        return bcrypt.compare(password, user.password).then((doMatch) => {
          if (doMatch) {
            const newCsrfToken = req.csrfToken();

            res.setHeader(
              "Set-Cookie",
              cookie.serialize("_csrf", newCsrfToken, {
                path: "/",
                httpOnly: true,
              })
            );

            jwt.sign(
              { username: user.name, email: user.email, id: user.id },
              secretKey,
              { expiresIn: "1h" },
              (err, token) => {
                if (err) {
                  throw new Error(err);
                }

                res.setHeader(
                  "Set-Cookie",
                  cookie.serialize("jwtToken", token, {
                    path: "/",
                    httpOnly: true,
                  })
                );

                res.status(200).send({
                  username: user.name,
                });
              }
            );
          } else {
            res.status(400).send({ message: "Password does not match!!" });
          }
        });
      })
      .catch((err) =>
        res.status(500).send({ message: `${err.message}. Unable to login.` })
      );
  }
};

exports.postLogout = (req, res) => {
  res.clearCookie("jwtToken", {
    httpOnly: true,
    secure: false,
  });

  res.clearCookie("_csrf", {
    httpOnly: true,
    secure: false,
  });

  res.status(200).send({
    message: "User logged out successfully!!",
  });
};

exports.postSignup = (req, res) => {
  const { username, email, password } = req.body;

  const result = validationResult(req);

  if (result.errors.length > 0) {
    res.status(400).send({
      message: result.errors[0].msg,
      inputName: result.errors[0].path,
    });
  } else {
    User.findOne({ where: { [Op.or]: [{ email: email }, { name: username }] } })
      .then((user) => {
        if (user?.email === email) {
          return res
            .status(409)
            .send({ message: "User with this email already exists!" });
        }
        if (user?.name === username) {
          return res.status(409).send({ message: "Username already taken" });
        }
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const newUser = User.build({
              name: username,
              email: email,
              password: hashedPassword,
            });
            return newUser.save().then(() => {
              return transporter.sendMail({
                to: email,
                from: "balonishradha@gmail.com",
                subject: "Signup Successful!",
                html: "<h1>Welcome to Wearify</h1>",
              });
            });
          })
          .catch((error) => {
            throw new Error("Failed to send signup email");
          });
      })
      .then(() => {
        res.status(200).send({ message: "User registered successfully!!" });
      })
      .catch((err) => {
        res.status(500).send({ message: "Unable to register user" });
      });
  }
};

exports.postResetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "Unable to reset password for the user" });
    }
    const token = buffer.toString("hex");
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .send({ message: "No account found with that email!" });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then((result) => {
          return transporter
            .sendMail({
              to: req.body.email,
              from: "balonishradha@gmail.com",
              subject: "Password Reset Request",
              html: `
            <p>You requested for a password reset</p>
            <p>Please click this <a href="${
              localFrontend || req.headers.origin
            }/auth/reset/${token}">link</a> to set a new password!</p>
          `,
            })
            .then((result) => {
              res
                .status(200)
                .send({ message: "Password reset link sent successfully" });
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Unable to generate password reset link" });
      });
  });
};

exports.changePassword = (req, res) => {
  const token = req.params.resetToken;
  const updatedPassword = req.body.updatedPassword;

  User.findOne({
    where: {
      [Op.and]: [
        { resetToken: token },
        { resetTokenExpiration: { [Op.gte]: Date.now() } },
      ],
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message:
            "No user found. Reset token either expired or does not exist.",
        });
      }
      return bcrypt.hash(updatedPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        return user.save().then((result) => {
          res.status(200).send({
            message: "Password updated successfully!",
            updatedUser: result,
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err.message });
    });
};
