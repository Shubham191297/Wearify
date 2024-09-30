const mongoose = require("mongoose");
const product = require("./product");
const Schema = mongoose.Schema;

const bagProductSchema = new Schema(
  {
    id: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const shoppingBagSchema = new Schema({
  products: {
    type: [bagProductSchema],
    required: true,
    default: [],
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  userId: {
    type: String,
    required: true,
  },
});

shoppingBagSchema.methods.addProduct = function (product) {
  const existingProduct = this.products.find(
    (prod) => prod.id === product._id.toString()
  );
  const existingProductIndex = this.products.findIndex(
    (prod) => prod.id === product._id.toString()
  );

  let updatedProduct;

  if (existingProduct) {
    updatedProduct = existingProduct.toObject();
    updatedProduct.quantity = updatedProduct.quantity + 1;
    this.products[existingProductIndex] = updatedProduct;
  } else {
    updatedProduct = { quantity: 1, id: product._id.toString() };
    this.products.push(updatedProduct);
  }
  this.totalPrice = this.totalPrice + +product.price;

  return this.save();
};

shoppingBagSchema.methods.deleteProductFromBag = function (product) {
  const existingProduct = this.products.find(
    (prod) => prod.id === product._id.toString()
  );
  const existingProductIndex = this.products.findIndex(
    (prod) => prod.id === product._id.toString()
  );

  if (existingProduct.quantity === 1) {
    this.products = this.products.filter(
      (prod) => prod.id !== product._id.toString()
    );
  } else {
    const updatedProduct = existingProduct.toObject();
    updatedProduct.quantity = updatedProduct.quantity - 1;
    this.products[existingProductIndex] = updatedProduct;
  }
  this.totalPrice = this.totalPrice - +product.price;

  return this.save();
};

shoppingBagSchema.statics.deleteProduct = function (prodId, price) {
  this.find()
    .then((shoppingBags) => {
      shoppingBags = shoppingBags.map((bag) => {
        const deletedProduct = bag.products.find((prod) => prod.id === prodId);

        if (deletedProduct) {
          bag.products = bag.products.filter((prod) => prod.id !== prodId);

          bag.totalPrice = bag.totalPrice - deletedProduct.quantity * price;
        }

        return bag;
      });

      const bagUpdatePromises = shoppingBags.map((bag) => {
        return bag.save();
      });

      return Promise.all(bagUpdatePromises);
    })
    .catch((err) => console.log(err));
};

shoppingBagSchema.statics.mergeShoppingBagDataWithGuest = function (
  mainBagId,
  guestBagData
) {
  return this.findById(mainBagId)
    .then((bag) => {
      for (item of guestBagData.items) {
        const guestBagItem = bag.products.find(
          (product) => product.id === item.productData._id
        );

        if (guestBagItem) {
          guestBagItem.quantity = guestBagItem.quantity + +item.quantity;
        } else {
          bag.products.push({
            id: item.productData._id,
            quantity: item.quantity,
          });
        }
      }

      bag.totalPrice = bag.totalPrice + +guestBagData.totalPrice;

      return bag.save();
    })
    .catch((err) => console.log(err));
};

shoppingBagSchema.methods.cleanBag = function () {
  this.products = [];
  this.totalPrice = 0;

  return this.save();
};

module.exports = mongoose.model("ShoppingBag", shoppingBagSchema);
