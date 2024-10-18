const express = require("express");

const adminController = require("../controllers/admin.js");
const isAdmin = require("../middleware/is-admin.js");
const validateProduct = require("../validation/productValidation.js");

const router = express.Router();

router.get("/products", isAdmin, adminController.getProducts);
router.get("/products/:productId", isAdmin, adminController.getProduct);
router.post(
  "/add-product",
  isAdmin,
  validateProduct,
  adminController.addProduct
);
router.put(
  "/edit-product/:productId",
  isAdmin,
  validateProduct,
  adminController.editProduct
);
router.delete("/delete-product", isAdmin, adminController.deleteProduct);

module.exports = router;
