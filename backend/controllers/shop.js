const Bag = require("../models/bag.js");
const Cart = require("../models/cart.js");
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
  console.log(req.user.shoppingBagId);
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
          })
        );
      });
    })
    .catch((err) => console.log(err));
};

exports.postShoppingBag = (req, res) => {
  const prodId = req.body.productId;
  const shoppingBagId = req.user.shoppingBagId;
  console.log(req.user);

  console.log(prodId);
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      return Bag.addProduct(shoppingBagId, prodId, product.price);
    })
    .then((bag) =>
      res
        .status(200)
        .send({ message: "product added to bag!", shoppingBag: bag })
    )
    .catch((err) => console.log(err));
};

// exports.deleteItemShoppingBag = (req, res) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, (product) => {
//     Cart.deleteProductFromCart(prodId, product.price);
//     res
//       .status(200)
//       .send({ message: "Product deleted successfully", product: product });
//   });
// };

// exports.getCheckout = (req, res) => {};

// exports.getOrders = (req, res) => {};
