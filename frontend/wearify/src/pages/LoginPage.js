import { Form, Link, redirect } from "react-router-dom";
import { mergeGuestShoppingBag } from "../guest/GuestBag";

const LoginPage = () => {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="POST">
          <div className="text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address / Username
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

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <Link
            href="#"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-5"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const pass = formData.get("password");

  const userData = await fetch("http://localhost:5000/auth/login", {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email: email, password: pass }),
  });

  const loginInfo = await userData.json();
  let bagMerge;

  if (loginInfo) {
    const guestBagData = JSON.parse(sessionStorage.getItem("guestShoppingBag"));
    let isAdmin = loginInfo.username === "AdminUser";
    console.log(isAdmin);

    if (guestBagData.items.length > 0 && !isAdmin) {
      bagMerge = await mergeGuestShoppingBag(guestBagData);
      console.log(bagMerge);
    }

    sessionStorage.setItem(
      "user",
      JSON.stringify({
        username: loginInfo.username,
        isLoggedIn: true,
        roleAdmin: isAdmin,
      })
    );
  }

  return redirect("/products");
}