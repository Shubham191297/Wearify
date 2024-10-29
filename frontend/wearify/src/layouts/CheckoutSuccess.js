import React from "react";
import { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { getCSRFToken } from "../context/auth";

const CheckoutSuccess = () => {
  const { checkOutOrder } = useLoaderData();

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Await resolve={checkOutOrder} errorElement={<ErrorPage />}>
        {(checkoutOrder) => {
          <h1>{checkoutOrder}</h1>;
        }}
      </Await>
    </Suspense>
  );
};

export default CheckoutSuccess;

async function loadCheckoutSuccess() {
  const csrfToken = await getCSRFToken();

  const resData = await fetch("http://localhost:5000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    body: JSON.stringify(bodyData),
    credentials: "include",
  });

  const data = await resData.json();

  if (!resData.ok) {
    throw new CustomError(resData.statusText, data.message, resData.status);
  }

  return null;
}

export function loader() {
  return defer({
    checkOutOrder: loadCheckoutSuccess(),
  });
}
