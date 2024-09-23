import React, { Suspense } from "react";
import { json, defer, useLoaderData, Await, redirect } from "react-router-dom";
import ShoppingBagOverview from "../components/ShoppingBagOverview";

const ShoppingBagPage = () => {
  const { shoppingBag } = useLoaderData();

  return (
    <div>
      {/* <NoProductsBag /> */}
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={shoppingBag}>
          {(loadShoppingBag) => (
            <ShoppingBagOverview shoppingBag={loadShoppingBag} />
          )}
        </Await>
      </Suspense>
    </div>
  );
};

export default ShoppingBagPage;

async function loadShoppingBag() {
  const response = await fetch("http://localhost:5000/shoppingBag/");

  if (!response.ok) {
    throw json(
      { message: "Unable to fetch shopping bag data" },
      { status: 500 }
    );
  } else {
    const shoppingBag = await response.json();
    return shoppingBag;
  }
}

export function loader() {
  return defer({
    shoppingBag: loadShoppingBag(),
  });
}

export async function action({ request }) {
  const formData = await request.formData();

  const deleteItemAction = request.method === "DELETE";

  const url =
    "http://localhost:5000/" +
    (deleteItemAction ? "shoppingBagItem" : "orders");

  const bodyData = deleteItemAction
    ? { productId: formData.get("productId") }
    : { shoppingBagId: formData.get("bagId") };

  const resData = await fetch(url, {
    method: request.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  });

  if (!resData.ok) {
    throw new Error("Failed to place the order");
  }

  const data = await resData.json();

  console.log({
    message: deleteItemAction
      ? "Deleted item from shopping bag"
      : "Order placed successfully!!",
    data: data,
  });

  return redirect(deleteItemAction ? "/shoppingBag" : "/orders");
}
