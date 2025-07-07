import React from "react";
import NextPageIcon from "../icons/NextPageIcon";
import PrevPageIcon from "../icons/PrevPageIcon";
import { Link } from "react-router-dom";

const Pagination = ({ page, lastPage, isAdmin }) => {
  const basePath = isAdmin ? "/admin/products" : "/products";

  return (
    <div className="items-center pt-8">
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        {page > 1 && (
          <Link
            to={`${basePath}?page=${page - 1}`}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Previous</span>
            <PrevPageIcon />
          </Link>
        )}
        <Link
          to={`${basePath}?page=${page}`}
          aria-current="page"
          className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {page}
        </Link>
        {page !== lastPage && (
          <Link
            to={`${basePath}?page=${lastPage}`}
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            {`...`}
          </Link>
        )}
        {page < lastPage && (
          <Link
            to={`${basePath}?page=${page + 1}`}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Next</span>
            <NextPageIcon />
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Pagination;
