const express = require("express");

const shopController = require("../controllers/shop.js");
const isAuth = require("../middleware/is-auth.js");

const router = express.Router();

router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);

router.get("/shoppingBag", shopController.getShoppingBag);
router.post("/shoppingBag", shopController.postShoppingBag);
router.delete("/shoppingBagItem", shopController.deleteItemShoppingBag);
router.put("/shoppingBag", shopController.mergeGuestShoppingBagData);

router.post("/orders", isAuth, shopController.postOrder);
router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
