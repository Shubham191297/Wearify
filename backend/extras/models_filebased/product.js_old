const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(product) {
    this.id = product.id;
    this.title = product.title;
    this.description = product.description;
    this.category = product.category;
    this.price = product.price;
    this.color = product.color;
    this.image = product.image;
  }

  save() {
    getProductsFromFile((products) => {
      // console.log(this.id);
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);

        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static deleteById(prodId) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === prodId);
      const updatedProducts = products.filter(
        (product) => product.id !== prodId
      );

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(prodId, product.price);
          return updatedProducts;
        }
      });
    });
  }

  static findById(prodId, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === prodId);
      cb(product);
    });
  }
};
