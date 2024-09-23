const Bag = require("../models/bag.js");
const Order = require("../models/order.js");
const Product = require("../models/product.js");

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      if (products.length !== 0) {
        const productsData = JSON.stringify(products);
        res.status(200).send(productsData);
      } else {
        res.status(200).send({ message: "No products found!" });
      }
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  console.log(prodId);

  Product.findById(prodId)
    .then((product) => res.status(200).send(product))
    .catch((err) => console.log(err));
};

exports.getShoppingBag = (req, res) => {
  Bag.getShoppingBag(req.user.shoppingBagId)
    .then((bag) => {
      Product.fetchAll().then((products) => {
        const bagProducts = [];
        for (product of products) {
          const bagProductData = bag.products.find(
            (prod) => prod.id === product._id.toString()
          );
          if (bagProductData) {
            bagProducts.push({
              productData: product,
              quantity: bagProductData.quantity,
            });
          }
        }
        res.status(200).send(
          JSON.stringify({
            totalPrice: bag.totalPrice,
            items: bagProducts,
            id: req.user.shoppingBagId,
          })
        );
      });
    })
    .catch((err) => console.log(err));
};

exports.postShoppingBag = (req, res) => {
  const prodId = req.body.productId;
  const shoppingBagId = req.user.shoppingBagId;

  console.log(prodId);
  Product.findById(prodId)
    .then((product) => {
      return Bag.addProduct(shoppingBagId, prodId, product.price);
    })
    .then((bag) =>
      res
        .status(200)
        .send({ message: "product added to bag!", shoppingBag: bag })
    )
    .catch((err) => console.log(err));
};

exports.deleteItemShoppingBag = (req, res) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return Bag.deleteProductFromBag(
        req.user.shoppingBagId,
        prodId,
        product.price
      );
    })
    .then((updatedBag) => {
      res.status(200).send({
        message: "Product deleted from bag successfully",
        updatedBag: updatedBag,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  const bagId = req.body.shoppingBagId;
  let orderProducts = [];
  let orderPrice = 0;

  Bag.getShoppingBag(bagId)
    .then((bag) => {
      orderProducts = bag.products;
      orderPrice = bag.totalPrice;
      return Bag.updateShoppingBag(bag, "clean");
    })
    .then(() => {
      const order = new Order(orderProducts, orderPrice, {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      });
      return order.save();
    })
    .then(() => {
      res.status(200).send({ message: "" });
    })
    .catch((err) => console.log(err));
};

// exports.getCheckout = (req, res) => {};

// exports.getOrders = (req, res) => {};
