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
const serverSettings = require("./utils/serverURL");

const User = require("./models/user");
const ShoppingBag = require("./models/bag");
// const sessionData = require("./utils/session-db");
const jwt = require("jsonwebtoken");
const API_BASE_PATH = process.env.CLUSTER_API_ENDPOINT_ROUTE || "";

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
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // curl/postman ke liye allow

      const isLocalhost = origin.includes("localhost:3000");
      const isNodePortAccess = /^http:\/\/\d{1,3}(\.\d{1,3}){3}:32000$/.test(
        origin
      );

      if (isLocalhost || isNodePortAccess) {
        return callback(null, true);
      } else {
        console.log("Blocked CORS origin:", origin);
        return callback(new Error("CORS policy: Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
// app.use(sessionData);
app.use(
  `${API_BASE_PATH + "/images"}`,
  express.static(path.join(__dirname, "images"))
);

app.use(cookieParser());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

const csrfToken = csrf({ cookie: true });
console.log(csrfToken);
app.use(csrfToken);

app.use((req, res, next) => {
  const token = req.headers?.cookie
    ?.split(";")
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

app.use(`${API_BASE_PATH + "/"}`, shopRoutes);
app.use(`${API_BASE_PATH + "/admin"}`, adminRoutes);
app.use(`${API_BASE_PATH + "/auth"}`, authRoutes);

psSequelize
  .sync()
  .then(() => {
    console.log("\nConnected to PG SQL successfully!!");
    mongoose
      .connect(mongoURL + "/wearify")
      .then(() => {
        console.log("Connected to Mongo DB successfully!!");
        app.listen(serverSettings.serverPort);
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
