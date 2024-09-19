const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/products", adminController.addProduct);
router.post("/add-product", adminController.addProduct);
router.put("/edit-product/:productId", adminController.editProduct);
router.delete("/delete-product", adminController.deleteProduct);

module.exports = router;
