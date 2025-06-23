const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const psSequelize = require("./utils/pgsql-database");
const mongoose = require("mongoose");
const { mongoURL } = require("./utils/db-url");
const path = require("path");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const User = require("./models/user");
const ShoppingBag = require("./models/bag");
// const sessionData = require("./utils/session-db");
const jwt = require("jsonwebtoken");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, "wearify-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const secretKey = require("./utils/secretKey");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
// app.use(sessionData);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cookieParser());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

const csrfToken = csrf({ cookie: true });
app.use(csrfToken);

app.use((req, res, next) => {
  const token = req.headers?.cookie
    .split(";")
    .find((cookieValue) => cookieValue.includes("jwtToken"))
    ?.split("=")[1];

  if (token) {
    jwt.verify(token, secretKey, (err, authData) => {
      User.findOne({ where: { name: authData.username } })
        .then((user) => {
          req.user = user;
          if (user.shoppingBagId || user.email === "admin@app.com") {
            return;
          }
          const shoppingBag = new ShoppingBag({ userId: user.id });
          return shoppingBag.save().then((result) => {
            req.user.shoppingBagId = result._id.toString();
            return req.user.save();
          });
        })
        .then(() => {
          next();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    next();
  }
});

app.use("/", shopRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

psSequelize
  .sync()
  .then(() => {
    console.log("\nConnected to PG SQL successfully!!");
    mongoose
      .connect(mongoURL + "/wearify")
      .then(() => {
        console.log("Connected to Mongo DB successfully!!");
        app.listen(5001);
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
