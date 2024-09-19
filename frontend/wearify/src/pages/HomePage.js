import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to Wearify
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Explore our new trends with exclusive offers. Best deals for you in
          clothing start from today. Avail your picks at discounted rates
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/products"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Let's wearify!
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
