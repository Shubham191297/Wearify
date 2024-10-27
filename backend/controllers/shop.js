const fs = require("fs");
const path = require("path");
const ShoppingBag = require("../models/bag.js");
const Order = require("../models/order.js");
const Product = require("../models/product.js");
const pdfGenerator = require("../data/pdfGenerator.js");

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      if (products.length !== 0) {
        const productsData = JSON.stringify(products);
        res.status(200).send(productsData);
      } else {
        res.status(200).send({ message: "No products found!" });
      }
    })
    .catch((err) =>
      res.status(500).send({ message: "Unable to load products!!" })
    );
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => res.status(200).send(product))
    .catch((err) =>
      res.status(404).send({ message: "Unable to find product" })
    );
};

exports.getShoppingBag = (req, res) => {
  const shoppingBagId = req.user.shoppingBagId;

  ShoppingBag.findById(shoppingBagId)
    .then((bag) => {
      Product.find().then((products) => {
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
    .catch((err) =>
      res.status(500).send({ message: "Unable to load shopping bag" })
    );
};

exports.postShoppingBag = (req, res) => {
  const prodId = req.body.productId;
  const shoppingBagId = req.user.shoppingBagId;

  let product;

  Product.findById(prodId)
    .then((productToBeAdded) => {
      product = productToBeAdded;
      return ShoppingBag.findById(shoppingBagId);
    })
    .then((shoppingBag) => {
      return shoppingBag.addProduct(product);
    })
    .then((result) =>
      res
        .status(201)
        .send({ message: "product added to bag!", shoppingBag: result })
    )
    .catch((err) =>
      res.status(500).send({ message: "Unable to Add product to Bag" })
    );
};

exports.deleteItemShoppingBag = (req, res) => {
  const prodId = req.body.productId;
  const shoppingBagId = req.user.shoppingBagId;

  let product;

  Product.findById(prodId)
    .then((productToBeRemoved) => {
      product = productToBeRemoved;
      return ShoppingBag.findById(shoppingBagId);
    })
    .then((shoppingBag) => shoppingBag.deleteProductFromBag(product))
    .then((updatedBag) => {
      res.status(200).send({
        message: "Product deleted from bag successfully",
        updatedBag: updatedBag,
      });
    })
    .catch((err) =>
      res.status(500).send({ messagge: "Unable to delete product from bag" })
    );
};

exports.postOrder = (req, res) => {
  const bagId = req.body.shoppingBagId;
  let bagProducts;
  let bagTotalPrice;

  ShoppingBag.findById(bagId)
    .then((bag) => {
      bagProducts = bag.products;
      bagTotalPrice = bag.totalPrice;

      return bag.cleanBag();
    })
    .then(() => {
      const userData = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      };

      const order = new Order({
        products: bagProducts,
        cost: bagTotalPrice,
        user: userData,
        placedAt: new Date(),
      });

      return order.save();
    })
    .then(() => {
      res.status(201).send({ message: "Order created" });
    })
    .catch((err) =>
      res.status(500).send({ message: "Unable to place order!" })
    );
};

exports.getOrders = (req, res) => {
  const userId = req.user.id;

  Order.find({ "user.id": userId })
    .then((orders) => {
      return Order.getOrders(orders);
    })
    .then((ordersData) => {
      res.status(200).send(ordersData);
    })
    .catch((err) => res.send(500).send({ message: "Unable to get orders!" }));
};

exports.mergeGuestShoppingBagData = (req, res) => {
  const shoppingBagId = req.user.shoppingBagId;

  ShoppingBag.mergeShoppingBagDataWithGuest(
    shoppingBagId,
    req.body.guestBagData
  )
    .then((result) => {
      res.status(200).send({
        message: "Shopping Bags merged!!",
        mergedBag: result,
      });
    })
    .catch((err) =>
      res.status(500).send({ message: "Unable to generate shopping bag!!" })
    );
};

exports.getInvoice = (req, res) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }
      if (order.user.id !== req.user.id.toString()) {
        return res
          .status(403)
          .send({ message: "Unauthorized. User not permitted access." });
      }
      const invoiceName = "invoices-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      pdfGenerator(res, invoicePath, orderId, order);
    })
    .catch((err) =>
      res.status(500).send({ message: "Unable to process your request" })
    );
};
