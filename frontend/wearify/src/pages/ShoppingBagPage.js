import React, { Suspense } from "react";
import { json, defer, useLoaderData, Await, redirect } from "react-router-dom";
import ShoppingBagOverview from "../components/ShoppingBagOverview";
import {
  loadGuestShoppingBag,
  removeItemFromGuestBag,
} from "../guest/GuestBag";
import CustomError from "../layouts/CustomError";
import ErrorPage from "../layouts/ErrorPage";
import { getCSRFToken } from "../context/auth";
import { serverURL } from "../utils/backendURL";

const ShoppingBagPage = () => {
  const { shoppingBag } = useLoaderData();

  return (
    <div>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={shoppingBag} errorElement={<ErrorPage />}>
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
  const guestShoppingBag = !sessionStorage.getItem("user");
  // const guestBagExist = sessionStorage.getItem("guestShoppingBag");

  if (guestShoppingBag) {
    return loadGuestShoppingBag();
  }

  const csrfToken = await getCSRFToken();
  const response = await fetch(`${serverURL}shoppingBag/`, {
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });

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
  const csrfToken = await getCSRFToken();

  const deleteItemAction = request.method === "DELETE";

  const guestShoppingBag = !sessionStorage.getItem("user");

  if (guestShoppingBag && deleteItemAction) {
    removeItemFromGuestBag(formData.get("productId"));
    return null;
  }

  if (guestShoppingBag && !deleteItemAction) {
    return redirect("/login");
  }

  const url = serverURL + (deleteItemAction ? "shoppingBagItem" : "checkout");

  const bodyData = deleteItemAction
    ? { productId: formData.get("productId") }
    : null;

  const resData = await fetch(url, {
    method: request.method,
    headers: {
      "X-CSRF-Token": csrfToken,
      "Content-Type": deleteItemAction ? "application/json" : "",
    },
    body: JSON.stringify(bodyData),
    credentials: "include",
  });

  const data = await resData.json();

  if (!resData.ok) {
    throw new CustomError(resData.statusText, data.message, resData.status);
  }

  if (!deleteItemAction) {
    window.location.href = data.url;
  }

  return deleteItemAction ? redirect("/shoppingBag") : null;
}
