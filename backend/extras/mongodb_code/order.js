const mongodb = require("mongodb");
const getDb = require("../utils/mongo-database").getDb;

class Order {
  constructor(products, cost, user) {
    this.products = products;
    this.cost = cost;
    this.user = user;
  }

  save() {
    const db = getDb();

    return db
      .collection("orders")
      .insertOne(this)
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  getOrders(userId) {
    const db = getDb();

    return db
      .collection("orders")
      .find({
        "user.id": userId,
      })
      .toArray();
  }
}

module.exports = Order;
