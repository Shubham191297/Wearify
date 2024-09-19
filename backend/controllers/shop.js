const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    if (products.length !== 0) {
      const productsData = JSON.stringify(products);
      res.status(200).send(productsData);
    } else {
      res.status(200).send({ message: "No products found!" });
    }
  });
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;

  Product.findById(prodId, (product) => res.status(200).send(product));
};

exports.getShoppingBag = (req, res) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity,
          });
        }
      }
      res.status(200).send(
        JSON.stringify({
          totalPrice: cart.totalPrice,
          items: cartProducts,
        })
      );
    });
  });
};

exports.postShoppingBag = (req, res) => {
  const prodId = req.body.productId;

  Product.findById(prodId, (prod) => {
    Cart.addProduct(prodId, prod.price);
    res.status(200).send({ message: "Product Added to Bag!" });
  });
};

exports.deleteItemShoppingBag = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProductFromCart(prodId, product.price);
    res
      .status(200)
      .send({ message: "Product deleted successfully", product: product });
  });
};

exports.getCheckout = (req, res) => {};

exports.getOrders = (req, res) => {};
