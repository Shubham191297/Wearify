import React, { Suspense } from "react";
import { Await, defer, json, useLoaderData } from "react-router-dom";
import OrdersOverview from "../components/OrdersOverview";

const OrdersPage = () => {
  const { orders } = useLoaderData();

  return (
    <div>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={orders}>
          {(loadOrders) => <OrdersOverview orders={loadOrders} />}
        </Await>
      </Suspense>
    </div>
  );
};

export default OrdersPage;

async function loadOrders() {
  const response = await fetch("http://localhost:5000/orders/");

  if (!response.ok) {
    throw json({ message: "Unable to fetch orders" }, { status: 500 });
  } else {
    const orders = await response.json();

    return orders;
  }
}

export function loader() {
  return defer({
    orders: loadOrders(),
  });
}
