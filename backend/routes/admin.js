const express = require("express");

const adminController = require("../controllers/admin.js");
const isAdmin = require("../middleware/is-admin.js");

const router = express.Router();

router.get("/products", isAdmin, adminController.getProducts);
router.get("/products/:productId", isAdmin, adminController.getProduct);
router.post("/add-product", isAdmin, adminController.addProduct);
router.put("/edit-product/:productId", isAdmin, adminController.editProduct);
router.delete("/delete-product", isAdmin, adminController.deleteProduct);

module.exports = router;
