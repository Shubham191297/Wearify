import React from "react";
import { Form, Link } from "react-router-dom";
import { serverURL } from "../utils/backendURL";

const ShoppingBagItems = ({ shoppingBagItems }) => {
  return (
    <div className="flow-root">
      <ul className="my-6 divide-y divide-gray-200 px-20">
        {shoppingBagItems.map((item) => (
          <li className="flex py-6" key={item.productData._id}>
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={`${serverURL}${item.productData.image}`}
                alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <Link to="#">{item.productData.title}</Link>
                  </h3>
                  <p className="ml-4">Rs. {item.productData.price}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <p className="text-gray-500">Qty x {item.quantity}</p>
                <div className="flex">
                  <Form method="DELETE">
                    <input
                      type="hidden"
                      name="productId"
                      value={item.productData._id}
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                      Remove
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingBagItems;
