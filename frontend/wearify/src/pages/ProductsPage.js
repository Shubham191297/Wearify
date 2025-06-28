import React, {
  Suspense,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { Await, defer } from "react-router-dom";
import { useLoaderData, useLocation } from "react-router-dom";
import ProductList from "../components/ProductList";
import AuthContext, { getCSRFToken } from "../context/auth";
import ErrorPage from "../layouts/ErrorPage";
import CustomError from "../layouts/CustomError";
import { serverURL } from "../utils/backendURL";

const ProductsPage = ({ adminPage = false }) => {
  const { products } = useLoaderData();
  const authCtx = useContext(AuthContext);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const page = parseInt(urlParams.get("page")) || 1; // Default to page 1
  // console.log(page);

  const loginUser = useCallback(
    (username, roleAdmin) => {
      authCtx.login(username, roleAdmin);
      setHasLoggedIn(true);
    },
    [authCtx]
  );

  useEffect(() => {
    const userInfo = sessionStorage.getItem("user");
    if (userInfo && !hasLoggedIn) {
      const parsedUser = JSON.parse(userInfo);
      loginUser(parsedUser.username, parsedUser.roleAdmin);
    }
  }, [loginUser, hasLoggedIn]);

  return (
    <div className="bg-white">
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={products} errorElement={<ErrorPage />}>
          {(loadProducts) => (
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Trends for this year
              </h2>
              <ProductList
                products={loadProducts.productsData}
                adminPage={adminPage}
                pageNumber={+page}
                lastPage={loadProducts.lastPage}
              />
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
};

export default ProductsPage;

async function loadProducts(isAdmin, { request }) {
  const csrfToken = await getCSRFToken();
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;

  const response = await fetch(
    serverURL + (isAdmin ? "admin/products/" : "products/") + `?page=${page}`,
    {
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    }
  );

  const products = await response.json();

  if (!response.ok) {
    throw new CustomError(
      response.statusText,
      products.message,
      response.status
    );
  }

  sessionStorage.setItem("products", JSON.stringify(products.productsData));

  return products;
}

export function loader({ request }) {
  return defer({
    products: loadProducts("", { request }),
  });
}

export function adminLoader({ request }) {
  return defer({
    products: loadProducts("admin", { request }),
  });
}
