const express = require("express");

const adminController = require("../controllers/admin.js");

const router = express.Router();

router.get("/products", adminController.getProducts);
router.post("/add-product", adminController.addProduct);
router.put("/edit-product/:productId", adminController.editProduct);
router.delete("/delete-product", adminController.deleteProduct);

module.exports = router;
