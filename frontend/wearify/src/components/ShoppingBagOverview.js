import React from "react";
import { Link } from "react-router-dom";
import NoProductsBag from "../pages/NoProductsBag";
import ShoppingBagItems from "./ShoppingBagItems";

const ShoppingBagOverview = ({ shoppingBag }) => {
  const shoppingBagEmpty = !shoppingBag || shoppingBag?.items.length === 0;
  const shoppingBagItems = shoppingBag?.items;

  return (
    <div className="flex w-full justify-center mt-6">
      {shoppingBagEmpty && <NoProductsBag />}
      {!shoppingBagEmpty && (
        <div className="pointer-events-auto border-2 rounded-md w-4/5 max-h-fit flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 justify-center">
            <h1
              className="text-xl font-medium text-gray-900"
              id="slide-over-title"
            >
              Shopping Bag
            </h1>
            <div className="flex justify-center">
              <div className="mt-8 w-11/12">
                <ShoppingBagItems shoppingBagItems={shoppingBagItems} />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="border-t border-gray-200 w-4/5 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>Rs. {shoppingBag.totalPrice}</p>
              </div>
              <div className="mt-6 flex-1">
                <Link
                  to="/checkout"
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-2 py-3 mx-40 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Checkout
                </Link>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  {"or "}
                  <Link
                    to="/products"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingBagOverview;
