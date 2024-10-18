import React, { Suspense } from "react";
import { defer, Await, useRouteLoaderData } from "react-router-dom";
import ProductForm from "./ProductForm";
import ErrorPage from "../layouts/ErrorPage";
import CustomError from "../layouts/CustomError";

const EditProduct = ({ editMode }) => {
  const { product } = useRouteLoaderData("edit-product");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={product} errorElement={<ErrorPage />}>
        {(loadProduct) => (
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Editing this Product
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <ProductForm product={loadProduct} editMode={true} />
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
};

export default EditProduct;

async function loadProduct(id) {
  const response = await fetch("http://localhost:5000/admin/products/" + id, {
    credentials: "include",
  });

  const product = await response.json();

  if (!response.ok) {
    throw new CustomError(
      response.statusText,
      product.message,
      response.status
    );
  } else {
    return product;
  }
}

export function loader({ request, params }) {
  return defer({
    product: loadProduct(params.productId),
  });
}
