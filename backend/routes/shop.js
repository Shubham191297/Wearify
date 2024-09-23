const express = require("express");

const shopController = require("../controllers/shop.js");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/shoppingBag", shopController.getShoppingBag);

router.post("/shoppingBag", shopController.postShoppingBag);

router.delete("/shoppingBagItem", shopController.deleteItemShoppingBag);

router.post("/orders", shopController.postOrder);
// router.get("/orders", shopController.getOrders);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
