import React from "react";
import { Link } from "react-router-dom";

const NoOrders = () => {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          No orders placed yet
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Order something and set your cart free !
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/shoppingBag"
            className="text-sm font-semibold text-gray-900"
          >
            Go to Bag <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link to="/products" className="text-sm font-semibold text-gray-900">
            Start shopping <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NoOrders;
