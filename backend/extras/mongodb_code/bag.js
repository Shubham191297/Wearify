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
    return Bag.getShoppingBag(shoppingBagId)
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

        return Bag.updateShoppingBag(shoppingBag, "update");
      })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  static deleteProductFromBag(shoppingBagId, prodId, price) {
    const db = getDb();
    return Bag.getShoppingBag(shoppingBagId)
      .then((shoppingBag) => {
        const existingProduct = shoppingBag.products.find(
          (product) => prodId === product.id
        );
        const existingProductIndex = shoppingBag.products.findIndex(
          (product) => prodId === product.id
        );

        if (existingProduct.quantity === 1) {
          shoppingBag.products = shoppingBag.products.filter(
            (product) => prodId !== product.id.toString()
          );
        } else {
          const updatedProduct = shoppingBag.products[existingProductIndex];
          updatedProduct.quantity = updatedProduct.quantity - 1;
          shoppingBag.products[existingProductIndex] = updatedProduct;
        }
        shoppingBag.totalPrice = shoppingBag.totalPrice - +price;

        return Bag.updateShoppingBag(shoppingBag, "update");
      })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  static deleteProduct(prodId, price) {
    const db = getDb();
    return db
      .collection("ShoppingBag")
      .find()
      .toArray()
      .then((shoppingBags) => {
        shoppingBags = shoppingBags.map((bag) => {
          const deletedProduct = bag.products.find(
            (prod) => prod.id === prodId
          );

          bag.products = bag.products.filter((prod) => prod.id !== prodId);

          bag.totalPrice = bag.totalPrice - deletedProduct.quantity * price;

          return bag;
        });

        const bagUpdatePromises = shoppingBags.map((bag) => {
          return Bag.updateShoppingBag(bag, "update");
        });

        return Promise.all(bagUpdatePromises);
      })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

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

  static updateShoppingBag(bag, action) {
    const db = getDb();

    const emptyBag = {
      products: [],
      totalPrice: 0,
      userId: bag.userId,
    };

    return db
      .collection("ShoppingBag")
      .updateOne(
        { _id: new mongodb.ObjectId(bag._id) },
        { $set: action === "clean" ? emptyBag : bag }
      );
  }
}

module.exports = Bag;
