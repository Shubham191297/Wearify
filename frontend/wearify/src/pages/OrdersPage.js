import React, { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import OrdersOverview from "../components/OrdersOverview";
import CustomError from "../layouts/CustomError";
import ErrorPage from "./ErrorPage";

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
  const response = await fetch("http://localhost:5000/orders/", {
    credentials: "include",
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
