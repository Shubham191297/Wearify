const fs = require("fs");
const path = require("path");
const ShoppingBag = require("../models/bag.js");
const Order = require("../models/order.js");
const Product = require("../models/product.js");
const pdfGenerator = require("../data/pdfGenerator.js");
const stripe = require("stripe")(
  "sk_test_51MM08RSARoTdkEyg0BxRBlmAb8jsdpzebSepcdV7f6IeMpcdSMZ2t2HFZKLDspp0t4bGbN5aodGzpE9r7Y0A6pmu006ZMOpoQR"
);

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

exports.postCheckout = (req, res) => {
  const shoppingBagId = req.user.shoppingBagId;
  let products;
  let totalPrice;

  ShoppingBag.findById(shoppingBagId)
    .then((bag) => {
      totalPrice = bag.totalPrice;

      const productItemsPromises = bag.products.map((prod) => {
        return Product.findById(prod.id).then((item) => ({
          id: prod.id,
          name: item.title,
          description: item.description,
          quantity: prod.quantity,
          price: item.price,
          image: item.image,
        }));
      });

      return Promise.all(productItemsPromises).then((items) => {
        products = items;

        return stripe.customers
          .create({
            name: "Shubham Thapliyal",
            address: {
              line1: "99 Pratham Paradise",
              city: "Vadodara",
              state: "Gujarat",
              postal_code: "390009",
              country: "IN",
            },
          })
          .then((customer) =>
            stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              line_items: products.map((p) => {
                return {
                  price_data: {
                    currency: "inr",
                    product_data: {
                      name: p.name,
                      description: p.description,
                    },
                    unit_amount: p.price * 100,
                  },
                  quantity: p.quantity,
                };
              }),
              mode: "payment",
              success_url: "http://localhost:3000/checkout-success",
              cancel_url: "http://localhost:3000/shoppingBag",
              customer: customer.id,
            })
          );
      });
    })
    .then((session) => {
      res.status(200).send({
        message: "Payment session created for user!",
        sessionId: session.id,
        totalSum: totalPrice,
        products: products,
        url: session.url,
      });
    })
    .catch((err) => console.log(err));
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
