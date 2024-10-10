import React from "react";
import { Form, redirect, useActionData } from "react-router-dom";
import { getCSRFToken } from "../context/auth";

const SignupPage = () => {
  const errors = useActionData();

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register with Wearify
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {errors && (
            <p className="text-sm text-red-600 mb-4">{errors.message}</p>
          )}
          <Form className="space-y-6" method="POST">
            <div className="text-left">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="text-left">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="text-left">
              {/* <div className="flex items-center justify-between"> */}
              <label
                htmlFor="confirmpass"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              {/* </div> */}
              <div className="mt-2">
                <input
                  id="confirmpass"
                  name="confirmpass"
                  type="password"
                  autoComplete=""
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
                Sign in
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

export async function action({ request }) {
  const formData = await request.formData();

  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmpass = formData.get("confirmpass");
  const errors = {};
  const csrfToken = await getCSRFToken();

  if (confirmpass !== password) {
    errors.message = "Entered passwords do not match!";
    return errors;
  }

  const res = await fetch("http://localhost:5000/auth/signup", {
    method: request.method,
    body: JSON.stringify({ username, email, password, confirmpass }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
  });

  const signupInfo = await res.json();

  if (!res.ok) {
    errors.message = signupInfo.message;
    return errors;
  }

  return redirect("/login");
}
