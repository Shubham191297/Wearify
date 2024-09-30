import React, { useContext } from "react";
import { Button, Disclosure } from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/auth";

const navigation = [
  { name: "Home", href: "/", current: false },
  { name: "Products", href: "/products", current: false },
  { name: "Add Product", href: "/admin/add-product", current: false },
  { name: "Admin Products", href: "/admin/products", current: false },
  {
    name: "Shopping Bag",
    href: "/shoppingBag",
    current: false,
  },
  { name: "Orders", href: "/orders", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const authCtx = useContext(AuthContext);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 ">
                {navigation.map((item) => {
                  const activeTab = item.href === currentPath;
                  const adminItem = item.href.startsWith("/admin");

                  if (adminItem && !authCtx.user?.roleAdmin) {
                    return null;
                  }
                  if (!authCtx.user?.isLoggedIn && item.name === "Orders") {
                    return null;
                  }
                  if (
                    !adminItem &&
                    authCtx.user.roleAdmin &&
                    item.name === "Shopping Bag"
                  ) {
                    return null;
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={activeTab ? "page" : undefined}
                      className={classNames(
                        activeTab
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium",
                        "flex justify-center"
                      )}
                    >
                      <span className="mr-2 align-bottom">{item.name}</span>
                      {item.name === "Shopping Bag" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            {!authCtx.user?.isLoggedIn && (
              <div className="ml-auto my-auto">
                <Link
                  to="/login"
                  className={classNames(
                    currentPath === "/login"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                >
                  Login
                </Link>
              </div>
            )}
            {authCtx.user.isLoggedIn && (
              <div className="ml-auto my-auto">
                <Button
                  className={classNames(
                    "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                  onClick={async () => {
                    const res = await fetch(
                      "http://localhost:5000/auth/logout",
                      {
                        method: "POST",
                        body: null,
                        credentials: "include",
                      }
                    );
                    const loggedOutInfo = await res.json();
                    console.log(loggedOutInfo);
                    authCtx.logout();
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default NavBar;
