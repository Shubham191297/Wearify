import React from "react";
import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import { getCSRFToken } from "../context/auth";

const productDefaultValue = {
  title: "",
  description: "",
  category: "",
  color: "",
  price: "",
  image: "",
};

const ProductForm = ({ product, editMode }) => {
  const [productDetails, setProductDetails] = useState(
    product ? product : productDefaultValue
  );

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevStateDetails) => ({
      ...prevStateDetails,
      [name]: value,
    }));
  };

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   setProductDetails(productDefaultValue);
  // };

  return (
    <Form method={editMode ? "PUT" : "POST"} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Title
        </label>
        <div className="mt-2">
          <input
            id="title"
            name="title"
            type="text"
            required
            onChange={inputChangeHandler}
            value={productDetails.title}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Description
        </label>
        <div className="mt-2">
          <textarea
            id="description"
            name="description"
            type="text"
            required
            onChange={inputChangeHandler}
            value={productDetails.description}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Category
        </label>
        <div className="mt-2">
          <input
            id="category"
            name="category"
            type="text"
            required
            onChange={inputChangeHandler}
            value={productDetails.category}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="color"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Color
        </label>
        <div className="mt-2">
          <input
            id="color"
            name="color"
            type="text"
            required
            onChange={inputChangeHandler}
            value={productDetails.color}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Price
        </label>
        <div className="mt-2">
          <input
            id="price"
            name="price"
            type="number"
            required
            onChange={inputChangeHandler}
            value={productDetails.price}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Image
        </label>
        <div className="mt-2">
          <input
            id="image"
            name="image"
            type="text"
            required
            onChange={inputChangeHandler}
            value={productDetails.image}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {editMode ? "Update " : "Add "} product
        </button>
      </div>
    </Form>
  );
};

export default ProductForm;

export async function action({ request, params }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const price = formData.get("price");
  const color = formData.get("color");
  const category = formData.get("category");
  const image = formData.get("image");
  const csrfToken = await getCSRFToken();

  const productData = {
    title: title,
    description: description,
    color: color,
    category: category,
    price: price,
    image: image,
  };

  const requestUrl =
    "http://localhost:5000/admin/" +
    (request.method === "POST"
      ? "add-product"
      : `edit-product/${params.productId}`);

  const product = await fetch(requestUrl, {
    method: request.method,
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    body: JSON.stringify(productData),
    credentials: "include",
  });
  await product.json();

  return redirect("/admin/products");
}
