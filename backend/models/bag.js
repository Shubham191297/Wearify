const mongodb = require("mongodb");
const getDb = require("../utils/mongo-database").getDb;

class Bag {
  constructor(userId) {
    this.products = [];
    this.totalPrice = 0;
    this.userId = userId;
  }

  static addProduct(shoppingBagId, prodId, price) {
    const db = getDb();
    return db
      .collection("ShoppingBag")
      .findOne({ _id: new mongodb.ObjectId(shoppingBagId) })
      .then((shoppingBag) => {
        const existingProduct = shoppingBag.products.find(
          (product) => product.id === prodId
        );
        const existingProductIndex = shoppingBag.products.findIndex(
          (product) => product.id === prodId
        );
        let updatedProduct;
        if (existingProduct) {
          updatedProduct = { ...existingProduct };
          updatedProduct.quantity = updatedProduct.quantity + +1;
          shoppingBag.products = [...shoppingBag.products];
          shoppingBag.products[existingProductIndex] = updatedProduct;
        } else {
          updatedProduct = { quantity: 1, id: prodId };
          shoppingBag.products = [...shoppingBag.products, updatedProduct];
        }
        shoppingBag.totalPrice = shoppingBag.totalPrice + +price;
        return db
          .collection("ShoppingBag")
          .updateOne(
            { _id: new mongodb.ObjectId(shoppingBagId) },
            { $set: shoppingBag }
          );
      })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  static deleteProductFromBag(shoppingBagId, prodId, price) {}

  static deleteProduct(prodId, price) {}

  save() {
    const db = getDb();
    return db
      .collection("ShoppingBag")
      .insertOne(this)
      .then((result) =>
        db.collection("ShoppingBag").findOne({ _id: result.insertedId })
      )
      .catch((err) => console.log(err));
  }

  static getShoppingBag(bagId) {
    const db = getDb();

    return db
      .collection("ShoppingBag")
      .findOne({ _id: new mongodb.ObjectId(bagId) })
      .then((bag) => bag)
      .catch((err) => console.log(err));
  }
}

module.exports = Bag;
