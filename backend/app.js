const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const psSequelize = require("./utils/pgsql-database");
const mongoConnect = require("./utils/mongo-database").mongoConnect;

const User = require("./models/user");
const ShoppingBag = require("./models/bag");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      if (user.shoppingBagId) {
        console.log("Shopping Bag already exists!");
        return;
      }
      const shoppingBag = new ShoppingBag(user.id);
      return shoppingBag.save().then((result) => {
        req.user.shoppingBagId = result._id.toString();
        console.log("here!!");
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

app.use("/", shopRoutes);
app.use("/admin", adminRoutes);

// app.use((req, res, next) => {
//   res.status(404).send("<h1>Page not found</h1>");
// });

psSequelize
  .sync()
  .then(() => {
    console.log("\nConnected to PG SQL successfully!!");
    mongoConnect(() => {
      console.log("Connected to Mongo DB successfully!!");
      app.listen(5000);
    });
  })
  .catch((err) => console.log(err));
