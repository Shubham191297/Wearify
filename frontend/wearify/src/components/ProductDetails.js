import React, { Suspense } from "react";
import { useRouteLoaderData, defer, Await } from "react-router-dom";
import ProductOverview from "./ProductOverview";
import CustomError from "../layouts/CustomError";
import ErrorPage from "../pages/ErrorPage";

const ProductDetails = () => {
  const { product } = useRouteLoaderData("product-detail");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={product} errorElement={<ErrorPage />}>
        {(loadProduct) => <ProductOverview product={loadProduct} />}
      </Await>
    </Suspense>
  );
};

export default ProductDetails;

async function loadProduct(id) {
  const response = await fetch("http://localhost:5000/products/" + id);

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
