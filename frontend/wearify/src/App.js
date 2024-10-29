import "./App.css";
import RootLayout from "./layouts/RootLayout";
import AddProduct from "./components/AddProduct";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProductsPage, {
  loader as productsLoader,
  adminLoader as adminProductsLoader,
} from "./pages/ProductsPage";
import ProductDetails, {
  loader as productDetailsLoader,
} from "./components/ProductDetails";
import EditProduct, {
  loader as editProductLoader,
} from "./components/EditProduct";
import ShoppingBagPage, {
  loader as shoppingBagLoader,
  action as shoppingBagActions,
} from "./pages/ShoppingBagPage";
import { loader as ordersLoader } from "./pages/OrdersPage";
import { action as productListActions } from "./components/ProductList";
import { action as productActions } from "./components/ProductForm";
import { action as orderActions } from "./components/OrdersOverview";
import LoginPage, { action as loginActions } from "./pages/LoginPage";
import ErrorPage from "./layouts/ErrorPage";
import OrdersPage from "./pages/OrdersPage";
import SignupPage, { action as signupActions } from "./pages/SignupPage";
import ResetPage, { action as resetPasswordActions } from "./layouts/ResetPage";
import ChangePassword, {
  action as changePasswordAction,
} from "./layouts/ChangePassword";
import CheckoutPage, { loader as checkoutLoader } from "./pages/CheckoutPage";
import CheckoutSuccess from "./layouts/CheckoutSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "products",
        children: [
          {
            index: true,
            loader: productsLoader,
            element: <ProductsPage key="products" />,
            action: productListActions,
          },
          {
            path: ":productId",
            id: "product-detail",
            loader: productDetailsLoader,
            element: <ProductDetails />,
          },
        ],
      },
      {
        path: "shoppingBag",
        loader: shoppingBagLoader,
        action: shoppingBagActions,
        element: <ShoppingBagPage />,
      },
      {
        path: "orders",
        loader: ordersLoader,
        action: orderActions,
        element: <OrdersPage />,
      },
      {
        path: "checkout",
        // loader: checkoutLoader,
        element: <CheckoutPage />,
      },
      {
        path: "checkout-success",
        element: <CheckoutSuccess />,
      },
      { path: "login", action: loginActions, element: <LoginPage /> },
      { path: "signup", action: signupActions, element: <SignupPage /> },
      {
        path: "*",
        element: (
          <ErrorPage
            status={404}
            message="Not Found"
            description="Sorry, we couldn’t find the page you’re looking for."
          />
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <RootLayout />,
    children: [
      { index: true, element: <ProductsPage /> },
      {
        path: "products",
        loader: adminProductsLoader,
        action: productListActions,
        element: <ProductsPage adminPage={true} key="admin-products" />,
      },
      { path: "add-product", element: <AddProduct />, action: productActions },
      {
        path: "edit-product/:productId",
        id: "edit-product",
        loader: editProductLoader,
        action: productActions,
        element: <EditProduct />,
      },
      {
        path: "*",
        element: (
          <ErrorPage
            status={404}
            message="Not Found"
            description="Sorry, we couldn’t find the page you’re looking for."
          />
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <RootLayout />,
    children: [
      {
        path: "reset-password",
        element: <ResetPage />,
        action: resetPasswordActions,
      },
      {
        path: "reset/:resetToken",
        element: <ChangePassword />,
        action: changePasswordAction,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
