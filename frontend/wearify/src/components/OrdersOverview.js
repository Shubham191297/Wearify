import React from "react";
import NoOrders from "../pages/NoOrders";

const OrdersOverview = ({ orders }) => {
  const noOrders = orders.length === 0;

  return (
    <div>
      {noOrders && <NoOrders />}
      {!noOrders && (
        <div className="w-3/4 mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mt-3">Your Orders</h1>
          <ul className="mx-auto border border-slate-300 rounded-md mt-4">
            {orders.map((order) => (
              <li className="w-11/12 mx-auto my-6" key={order._id}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-left pl-4 pt-2">
                  Order - #{order._id}
                </h2>
                <ul className="divide-y divide-gray-100 border border-slate-300 rounded-md mx-auto">
                  {order.products.map((product) => (
                    <li
                      className="flex justify-between gap-x-6 py-5 w-11/12 mx-auto"
                      key={product.id}
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <img
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                          src={product.image}
                          alt=""
                        />
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {product.title}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                            {product.description}
                          </p>
                        </div>
                      </div>
                      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm leading-6 text-gray-900">
                          Rs. {product.price}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Qty x {product.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                  <div className="flex flex-row justify-between p-4">
                    <p className="mt-1 text-sm leading-5 text-gray-800 pl-6">
                      Order Amount
                    </p>
                    <p className="mt-1 text-sm leading-5 text-black font-bold pr-12">
                      Rs. {order.cost}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-gray-800 text-right p-4">
                    Placed at{" "}
                    <time dateTime="2023-01-23T13:23Z">{order.placedAt}</time>
                  </p>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrdersOverview;