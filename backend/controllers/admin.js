const Product = require("../models/product.js");
const ShoppingBag = require("../models/bag.js");

exports.addProduct = (req, res) => {
  const { title, description, category, color, price, image } = req.body;
  const product = new Product({
    title: title,
    description: description,
    category: category,
    color: color,
    price: price,
    image: image,
    userId: req.user.id,
  });

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
  const { title, description, category, color, price, image } = req.body;

  Product.findById(req.params.productId)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.category = category;
      product.color = color;
      product.price = price;
      product.image = image;

      return product.save();
    })
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

  Product.findById(productId)
    .then((product) => ShoppingBag.deleteProduct(productId, product.price))
    .then(() => Product.findByIdAndDelete(productId))
    .then((result) => {
      res
        .status(200)
        .send({ message: "Product was deleted!", deletedProduct: result });
    })
    .catch((err) => console.log(err));
};
