const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");

const orderProductSchema = new Schema(
  {
    id: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new Schema({
  products: {
    type: [orderProductSchema],
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  user: {
    type: userSchema,
    required: true,
  },
  placedAt: {
    type: String,
    required: true,
  },
});

orderSchema.statics.getOrders = function (orders) {
  const ordersData = [];

  return Product.find()
    .then((products) => {
      orders.forEach((order) => {
        const orderData = order.toObject();

        orderData.products = orderData.products.map((item) => {
          const orderedProduct = products.find(
            (product) => product._id.toString() === item.id
          );

          return {
            ...item,
            title: orderedProduct.title,
            description: orderedProduct.description,
            image: orderedProduct.image,
            price: orderedProduct.price,
          };
        });
        const { user, ...orderDetails } = orderData;

        ordersData.push(orderDetails);
      });
      return ordersData;
    })
    .catch((err) => console.log(err));
};

module.exports = mongoose.model("Orders", orderSchema);

//   static getOrders(userId) {
//     const db = getDb();
//     let ordersData = [];

//     return db
//       .collection("orders")
//       .find({
//         "user.id": userId,
//       })
//       .toArray()
//       .then((orders) => {
//         ordersData = orders;
//         return Product.fetchAll();
//       })
//       .then((products) => {
//         ordersData = ordersData.map((order) => {
//           order.products = order.products.map((prod) => {
//             const orderedProduct = products.find(
//               (product) => product._id.toString() === prod.id
//             );

//             const productDetails = {
//               ...prod,
//               title: orderedProduct.title,
//               description: orderedProduct.description,
//               price: orderedProduct.price,
//               image: orderedProduct.image,
//             };

//             return productDetails;
//           });

//           const { user, ...orderDetails } = order;

//           return orderDetails;
//         });
//         return ordersData;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Order;
