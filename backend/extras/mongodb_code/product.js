const mongodb = require("mongodb");
const Bag = require("./bag");
const getDb = require("../utils/mongo-database").getDb;

class Product {
  constructor({
    title,
    category,
    price,
    color,
    description,
    image,
    _id,
    userId,
  }) {
    this.title = title;
    this.category = category;
    this.price = price;
    this.color = color;
    this.description = description;
    this.image = image;
    if (_id) {
      this._id = new mongodb.ObjectId(_id);
    }
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp.then((result) => result).catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(productId) {
    const db = getDb();

    return Product.findById(productId)
      .then((product) => {
        return Bag.deleteProduct(productId, product.price);
      })
      .then((result) =>
        db
          .collection("products")
          .deleteOne({
            _id: new mongodb.ObjectId(productId),
          })
          .then((result) => {
            return result;
          })
      )
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
