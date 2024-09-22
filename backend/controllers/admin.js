const Product = require("../models/product.js");

exports.addProduct = (req, res) => {
  const product = new Product({ ...req.body, userId: req.user.id });

  product
    .save()
    .then((result) => {
      res.status(200).send({
        message: "Product was added successfully!!",
        productDetails: result,
      });
    })
    .catch((err) => console.log(err));
};

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

exports.editProduct = (req, res) => {
  const product = new Product({
    ...req.body,
    _id: req.params.productId,
    userId: req.user.id,
  });

  product
    .save()
    .then((result) => {
      res.status(200).send({
        message: "Product updated successfully",
        updatedProduct: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then((result) => {
      res
        .status(200)
        .send({ message: "Product was deleted!", deletedProduct: result });
    })
    .catch((err) => console.log(err));
};
