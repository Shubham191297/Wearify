import React from "react";
import { useState } from "react";
import { Form, redirect, useActionData } from "react-router-dom";
import { getCSRFToken } from "../context/auth";
import { serverURL } from "../utils/backendURL";

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

  const errors = useActionData();

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevStateDetails) => ({
      ...prevStateDetails,
      [name]: value,
    }));
  };

  const fileChangeHandler = (event) => {
    const value = event.target.files[0];
    const { name } = event.target;
    setProductDetails((prevStateDetails) => ({
      ...prevStateDetails,
      [name]: value,
    }));
  };

  return (
    <div>
      {errors?.message && (
        <p className="text-md text-red-600 mb-4">{errors.message}</p>
      )}
      <Form
        method={editMode ? "PUT" : "POST"}
        className="space-y-6"
        encType="multipart/form-data"
        noValidate
      >
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
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 ${
                errors?.inputName === "title"
                  ? "bg-red-200 ring-red-600"
                  : "ring-gray-300"
              } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
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
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 ${
                errors?.inputName === "description"
                  ? "bg-red-200 ring-red-600"
                  : "ring-gray-300"
              } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
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
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 ${
                errors?.inputName === "category"
                  ? "bg-red-200 ring-red-600"
                  : "ring-gray-300"
              } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
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
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 ${
                errors?.inputName === "color"
                  ? "bg-red-200 ring-red-600"
                  : "ring-gray-300"
              } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
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
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 ${
                errors?.inputName === "price"
                  ? "bg-red-200 ring-red-600"
                  : "ring-gray-300"
              } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
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
              type="file"
              accept="image/*"
              required
              onChange={fileChangeHandler}
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 ${
                errors?.inputName === "image"
                  ? "bg-red-200 ring-red-600"
                  : "ring-gray-300"
              } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
              // className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
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
    </div>
  );
};

export default ProductForm;

export async function action({ request, params }) {
  const formData = await request.formData();

  const csrfToken = await getCSRFToken();
  const errors = {};

  const requestUrl =
    `${serverURL}admin/` +
    (request.method === "POST"
      ? "add-product"
      : `edit-product/${params.productId}`);

  const resData = await fetch(requestUrl, {
    method: request.method,
    headers: { "X-CSRF-Token": csrfToken },
    body: formData,
    credentials: "include",
  });

  const product = await resData.json();

  if (!resData.ok) {
    errors.message = product.message;
    errors.inputName = product.inputName;
    return errors;
  }

  return redirect("/admin/products");
}
