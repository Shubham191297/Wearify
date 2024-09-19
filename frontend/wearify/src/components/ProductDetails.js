import React, { Suspense } from "react";
import { useRouteLoaderData, json, defer, Await } from "react-router-dom";
import ProductOverview from "./ProductOverview";

const ProductDetails = () => {
  const { product } = useRouteLoaderData("product-detail");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={product}>
        {(loadProduct) => <ProductOverview product={loadProduct} />}
      </Await>
    </Suspense>
  );
};

export default ProductDetails;

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
