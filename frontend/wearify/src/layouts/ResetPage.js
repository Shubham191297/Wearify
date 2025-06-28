import React from "react";
import { Form, useActionData } from "react-router-dom";
import { getCSRFToken } from "../context/auth";
import { serverURL } from "../utils/backendURL";

const ResetPage = () => {
  const responseMessage = useActionData();

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {responseMessage && (
        <p
          className={`text-md text-${
            responseMessage.type === "error" ? "red" : "green"
          }-600 mb-4`}
        >
          {responseMessage.message}
        </p>
      )}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="POST">
          <div className="text-left">
            <label
              htmlFor="userEmail"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Enter your email address
            </label>
            <div className="mt-2">
              <input
                id="userEmail"
                name="userEmail"
                type="email"
                autoComplete="email"
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
              Reset password
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ResetPage;

export async function action({ request }) {
  const formData = await request.formData();
  const userEmail = formData.get("userEmail");
  const csrfToken = await getCSRFToken();

  const resData = await fetch(`${serverURL}auth/reset-password`, {
    body: JSON.stringify({ email: userEmail }),
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
  });
  const data = await resData.json();
  const response = {};
  if (!resData.ok) {
    response.type = "error";
  }

  return { ...response, message: data.message };
}
