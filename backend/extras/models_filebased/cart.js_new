const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the products from file
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err && fileContent.length > 0) {
        cart = JSON.parse(fileContent);
      }

      if (!Array.isArray(cart.products)) {
        cart.products = [];
      }
      if (typeof cart.totalPrice !== "number") {
        cart.totalPrice = 0;
      }

      // Analyze the cart => Find existing product
      const existingProduct = cart.products.find(
        (product) => product.id === id
      );
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };

      const product = updatedCart.products.find((prod) => prod.id === id);

      if (!product) {
        return;
      }

      const productQty = product.quantity;

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productQty * productPrice;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProductFromCart(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };

      const existingProduct = updatedCart.products.find(
        (prod) => prod.id === id
      );
      console.log(existingProduct);
      const existingProductIndex = updatedCart.products.findIndex(
        (prod) => prod.id === id
      );

      if (existingProduct.quantity > 1) {
        const updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity - 1;
        updatedCart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedCart.products = updatedCart.products.filter(
          (prod) => prod.id !== id
        );
      }

      updatedCart.totalPrice = updatedCart.totalPrice - +productPrice;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cartDefaultValue = { products: [], totalPrice: 0 };
      if (fileContent.length === 0) {
        cb(cartDefaultValue);
      } else {
        const cart = JSON.parse(fileContent);
        if (err) {
          cb(null);
        } else {
          cb(cart);
        }
      }
    });
  }
};
