import React, { Suspense } from "react";
import { json, defer, Await, useRouteLoaderData } from "react-router-dom";
import ProductForm from "./ProductForm";

const EditProduct = ({ editMode }) => {
  const { product } = useRouteLoaderData("edit-product");

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Editing this Product
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
          <Await resolve={product}>
            {(loadProduct) => (
              <ProductForm product={loadProduct} editMode={true} />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

export default EditProduct;

async function loadProduct(id) {
  const response = await fetch("http://localhost:5000/products/" + id);

  if (!response.ok) {
    throw json({ message: "Could not load product" }, { status: 500 });
  } else {
    const product = await response.json();
    return product;
  }
}

export function loader({ request, params }) {
  return defer({
    product: loadProduct(params.productId),
  });
}
