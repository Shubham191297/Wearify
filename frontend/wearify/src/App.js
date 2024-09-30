import "./App.css";
import RootLayout from "./layouts/RootLayout";
import AddProduct from "./components/AddProduct";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProductsPage, { loader as productsLoader } from "./pages/ProductsPage";
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
import LoginPage, { action as loginActions } from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import OrdersPage from "./pages/OrdersPage";

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
            element: <ProductsPage />,
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
      { path: "orders", loader: ordersLoader, element: <OrdersPage /> },
      { path: "login", action: loginActions, element: <LoginPage /> },
      { path: "logout", element: null },
      {
        path: "*",
        element: <ErrorPage />,
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
        loader: productsLoader,
        action: productListActions,
        element: <ProductsPage />,
      },
      { path: "add-product", element: <AddProduct />, action: productActions },
      {
        path: "edit-product/:productId",
        id: "edit-product",
        loader: editProductLoader,
        action: productActions,
        element: <EditProduct />,
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
