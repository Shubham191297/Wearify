const mongodb = require("mongodb");
const Product = require("./product");
const getDb = require("../utils/mongo-database").getDb;

class Order {
  constructor(products, cost, user) {
    this.products = products;
    this.cost = cost;
    this.user = user;
    this.placedAt = new Date();
  }

  save() {
    const db = getDb();

    return db
      .collection("orders")
      .insertOne(this)
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  static getOrders(userId) {
    const db = getDb();
    let ordersData = [];

    return db
      .collection("orders")
      .find({
        "user.id": userId,
      })
      .toArray()
      .then((orders) => {
        ordersData = orders;
        return Product.fetchAll();
      })
      .then((products) => {
        ordersData = ordersData.map((order) => {
          order.products = order.products.map((prod) => {
            const orderedProduct = products.find(
              (product) => product._id.toString() === prod.id
            );

            const productDetails = {
              ...prod,
              title: orderedProduct.title,
              description: orderedProduct.description,
              price: orderedProduct.price,
              image: orderedProduct.image,
            };

            return productDetails;
          });

          const { user, ...orderDetails } = order;

          return orderDetails;
        });
        return ordersData;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Order;
