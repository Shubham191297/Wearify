import React, {
  Suspense,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useLocation, Await, json, defer } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import ProductList from "../components/ProductList";
import AuthContext from "../context/auth";
import ErrorPage from "../pages/ErrorPage";

const ProductsPage = () => {
  const location = useLocation();
  const adminPage = location.pathname === "/admin/products";
  const { products } = useLoaderData();
  const authCtx = useContext(AuthContext);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

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

  const adminUser = authCtx.user.username === "AdminUser";
  if (!adminUser && location.pathname.startsWith("/admin")) {
    return (
      <ErrorPage
        statusCode={403}
        message="Sorry you are unauthorized to access this page. It requires admin privileges"
      />
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Trends for this year
        </h2>
        <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
          <Await resolve={products}>
            {(loadProducts) => (
              <ProductList products={loadProducts} adminPage={adminPage} />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;

async function loadProducts() {
  const response = await fetch("http://localhost:5000/products/", {
    credentials: "include",
  });

  if (!response.ok) {
    throw json({ message: "Unable to fetch products" }, { status: 500 });
  } else {
    const products = await response.json();
    sessionStorage.setItem("products", JSON.stringify(products));
    return products;
  }
}

export function loader() {
  return defer({
    products: loadProducts(),
  });
}
