const Product = require("../models/product.js");
const ShoppingBag = require("../models/bag.js");
const { validationResult } = require("express-validator");
const fileHelper = require("../utils/file.js");

exports.addProduct = (req, res) => {
  const { title, description, category, color, price } = req.body;
  const imagePath = req.file?.path;

  const result = validationResult(req);

  if (!imagePath) {
    res.status(400).send({
      message: "Either no image is provided or provided file is not a image",
      inputName: "image",
    });
  } else if (result.errors.length > 0) {
    res.status(400).send({
      message: result.errors[0].msg,
      inputName: result.errors[0].path,
    });
  } else {
    const product = new Product({
      title: title,
      description: description,
      category: category,
      color: color,
      price: price,
      image: imagePath,
    });

    product
      .save()
      .then((result) => {
        res.status(201).send({
          message: "Product was added successfully!!",
          productDetails: result,
        });
      })
      .catch((err) =>
        res.status(500).send({ message: "Unable to add product" })
      );
  }
};

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
      res.status(500).send({ message: "Unable to fetch products" })
    );
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => res.status(200).send(product))
    .catch((err) => res.status(404).send({ message: "Product not found" }));
};

exports.editProduct = (req, res) => {
  const { title, description, category, color, price } = req.body;
  const imagePath = req.file?.path;

  const result = validationResult(req);

  if (result.errors.length > 0) {
    console.log(result.errors);
    res.status(400).send({
      message: result.errors[0].msg,
      inputName: result.errors[0].path,
    });
  } else {
    Product.findById(req.params.productId)
      .then((product) => {
        product.title = title;
        product.description = description;
        product.category = category;
        product.color = color;
        product.price = price;
        if (imagePath) {
          fileHelper.deleteFile(product.image);
          product.image = imagePath;
        }

        return product.save();
      })
      .then((result) => {
        res.status(200).send({
          message: "Product updated successfully",
          updatedProduct: result,
        });
      })
      .catch((err) =>
        res.status(500).send({ message: "Unable to modify product" })
      );
  }
};

exports.deleteProduct = (req, res) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      fileHelper.deleteFile(product.image);
      return ShoppingBag.deleteProduct(productId, product.price);
    })
    .then(() =>
      Product.deleteOne({ _id: productId }).then((result) => {
        console.log("Deleted product successfully!");
        res
          .status(200)
          .send({ message: "Product was deleted!", deletedProduct: result });
      })
    )
    .catch((err) =>
      res.status(500).send({ message: "Unable to delete product" })
    );
};
