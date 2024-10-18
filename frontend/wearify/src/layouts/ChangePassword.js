import React from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";
import { getCSRFToken } from "../context/auth";

const ChangePassword = () => {
  const actionData = useActionData();
  const navigate = useNavigate();

  if (actionData && !actionData.error) {
    setTimeout(() => {
      navigate("/login");
    }, 6000);
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {actionData && (
          <p
            className={`text-md text-${
              actionData.error ? "red" : "green"
            }-600 mb-4`}
          >
            {actionData.message}
          </p>
        )}
        <Form className="space-y-6" method="POST">
          <div className="text-left">
            <label
              htmlFor="newPass"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              New password
            </label>
            <div className="mt-2">
              <input
                id="newPass"
                name="newPass"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="text-left">
            <label
              htmlFor="confirmPass"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm password
            </label>
            <div className="mt-2">
              <input
                id="confirmPass"
                name="confirmPass"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Change password
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;

export async function action({ params, request }) {
  const resetTokenValue = params.resetToken;
  const csrfToken = await getCSRFToken();
  const formData = await request.formData();
  const updatedPassword = formData.get("newPass");
  const confirmPassword = formData.get("confirmPass");
  const actionData = {};

  if (updatedPassword !== confirmPassword) {
    actionData.message = "Entered passwords do not match!";
    actionData.error = true;
    return actionData;
  }

  const resData = await fetch(
    `http://localhost:5000/auth/change-password/${resetTokenValue}`,
    {
      method: request.method,
      body: JSON.stringify({ updatedPassword }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
    }
  );
  const data = await resData.json();
  actionData.message = data.message;

  if (!resData.ok) {
    actionData.error = true;
  }
  return actionData;
}
