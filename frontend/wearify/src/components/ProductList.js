import React from "react";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import BagIcon from "../icons/BagIcon";
import { Form, Link, redirect } from "react-router-dom";
import { addItemToGuestBag } from "../guest/GuestBag";
import { getCSRFToken } from "../context/auth";
import { imagePath } from "../utils/imagePath";
import Pagination from "../layouts/Pagination";
import { serverURL } from "../utils/backendURL";

const ProductItem = ({ adminPage, products, pageNumber, lastPage }) => {
  return (
    <div>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.length !== 0 &&
          products.map((product) => (
            <div className="group relative" key={product._id}>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={`${imagePath}${product.image}`}
                  alt="Front of men&#039;s Basic Tee in black."
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                ></img>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="w-3/5">
                  <h4 className="text-md text-gray-700 font-bold font-serif mx-3 text-left">
                    <Link to={`/products/${product._id}`}>{product.title}</Link>
                  </h4>
                  <p className="mt-2 text-sm text-gray-700 mx-2 truncate text-left">
                    {product.description}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Rs. {product.price}
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-500 mx-3 flex justify-between">
                Color:
                <label
                  aria-label="White"
                  className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-none"
                >
                  <span
                    aria-hidden="true"
                    className={`h-5 w-5 rounded-full border border-black border-opacity-10`}
                    style={{ backgroundColor: `${product.color}` }}
                  ></span>
                </label>
              </p>
              {!adminPage && (
                <Form method="POST">
                  <input type="hidden" name="productId" value={product._id} />
                  <input type="hidden" name="actionType" value="cart-action" />
                  <button
                    type="submit"
                    className="mt-4 mx-1 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-2 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="mx-2">Add to Bag </span>
                    <BagIcon />
                  </button>
                </Form>
              )}
              {adminPage && (
                <div className="flex mx-2 mt-2">
                  <Link
                    to={`/admin/edit-product/${product._id}`}
                    className="mt-4 mx-1 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-2 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="mx-2">Edit </span>
                    <EditIcon />
                  </Link>
                  <Form method="DELETE">
                    <input type="hidden" name="productId" value={product._id} />
                    <input type="hidden" name="actionType" value="" />
                    <button
                      type="submit"
                      className="mt-4 mx-1 flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <span className="mx-2">Delete </span>
                      <DeleteIcon />
                    </button>
                  </Form>
                </div>
              )}
            </div>
          ))}
      </div>
      <Pagination page={pageNumber} lastPage={lastPage} />
    </div>
  );
};

export default ProductItem;

export async function action({ request }) {
  const formData = await request.formData();
  const productId = formData.get("productId");
  const actionType = formData.get("actionType");
  const csrfToken = await getCSRFToken();

  const guestShoppingBag = !sessionStorage.getItem("user");

  if (guestShoppingBag && actionType === "cart-action") {
    addItemToGuestBag(productId);
    return redirect("/shoppingBag");
  }

  const requestUrl =
    serverURL +
    (actionType === "cart-action" ? "shoppingBag" : "admin/delete-product");

  const response = await fetch(requestUrl, {
    method: request.method,
    body: JSON.stringify({ productId }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      request.actionType === "cart-action"
        ? "Failed to delete product"
        : "Failed to add product to bag"
    );
  }
  await response.json();

  return redirect(
    actionType === "cart-action" ? "/shoppingBag" : "/admin/products"
  );
}
