import React, { useContext } from "react";
import ProductForm from "./ProductForm";
import AuthContext from "../context/auth";
import ErrorPage from "../pages/ErrorPage";

const AddProduct = () => {
  const authCtx = useContext(AuthContext);
  if (authCtx.user.username !== "AdminUser") {
    return (
      <ErrorPage
        message="Forbidden"
        description="You are not authorized to access these resources. You would need admin privileges."
        status={403}
      />
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Add New Product
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <ProductForm />
      </div>
    </div>
  );
};

export default AddProduct;
