import React, { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import OrdersOverview from "../components/OrdersOverview";
import CustomError from "../layouts/CustomError";
import ErrorPage from "../layouts/ErrorPage";
import { getCSRFToken } from "../context/auth";
import { serverURL } from "../utils/backendURL";

const OrdersPage = () => {
  const { orders } = useLoaderData();

  return (
    <div>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={orders} errorElement={<ErrorPage />}>
          {(loadOrders) => <OrdersOverview orders={loadOrders} />}
        </Await>
      </Suspense>
    </div>
  );
};

export default OrdersPage;

async function loadOrders() {
  const csrfToken = await getCSRFToken();
  const response = await fetch(`${serverURL}orders/`, {
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
  const orders = await response.json();

  if (!response.ok) {
    throw new CustomError(response.statusText, orders.message, response.status);
  } else {
    return orders;
  }
}

export function loader() {
  return defer({
    orders: loadOrders(),
  });
}
