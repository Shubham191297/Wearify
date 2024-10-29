import React from "react";
import { Suspense } from "react";
import { Await, defer, useLoaderData, useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { getCSRFToken } from "../context/auth";

const CheckoutSuccess = () => {
  const { checkOutOrder } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={checkOutOrder} errorElement={<ErrorPage />}>
        {(checkoutOrderDetails) => {
          setTimeout(() => {
            navigate("/orders");
          }, 3000);
          return (
            <div className="flex w-full justify-center mt-6">
              <div className="pointer-events-auto border-2 rounded-md w-4/5 flex flex-col">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 justify-center">
                  <h1
                    className="text-xl font-medium text-gray-900"
                    id="slide-over-title"
                  >
                    Order placed successfully!
                  </h1>
                  <h2>{checkoutOrderDetails.id}</h2>
                  <div className="flex justify-center">
                    <div className="mt-8 w-11/12">
                      <ul className="my-6 divide-y divide-gray-200 px-20">
                        {checkoutOrderDetails.items.map((item) => (
                          <li className="flex py-6" key={item.productData._id}>
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={`http://localhost:5000/${item.productData.image}`}
                                alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <p>{item.productData.title}</p>
                                  </h3>
                                  <p className="ml-4">
                                    Rs. {item.productData.price}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <p className="text-gray-500">
                                  Qty x {item.quantity}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="border-t border-gray-200 w-4/5 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>Rs. {checkoutOrderDetails.totalPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
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
    headers: { "X-CSRF-Token": csrfToken },
    credentials: "include",
  });

  const data = await resData.json();

  return data;
}

export function loader() {
  return defer({
    checkOutOrder: loadCheckoutSuccess(),
  });
}
