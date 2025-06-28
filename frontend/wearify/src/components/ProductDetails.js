import React, { Suspense } from "react";
import { useRouteLoaderData, defer, Await } from "react-router-dom";
import ProductOverview from "./ProductOverview";
import CustomError from "../layouts/CustomError";
import ErrorPage from "../layouts/ErrorPage";
import { getCSRFToken } from "../context/auth";
import { serverURL } from "../utils/backendURL";

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
  const csrfToken = await getCSRFToken();
  const response = await fetch(serverURL + "products/" + id, {
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
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
