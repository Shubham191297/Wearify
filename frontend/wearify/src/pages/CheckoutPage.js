import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../layouts/CheckoutForm";
import { Await, defer, useLoaderData } from "react-router-dom";
import { getCSRFToken } from "../context/auth";
import { Suspense } from "react";
import ErrorPage from "../layouts/ErrorPage";

const stripePromise = loadStripe(
  "pk_test_51MM08RSARoTdkEygCUfdGYs2XOxONndFij0XXSWBcyGZBHAuOsa8ZyaNMzDLayqcVJmqufCcxpp9qJ2HWGgrVQ9H0050SA7Gov"
);

const CheckoutPage = () => {
  const items = [
    {
      id: 1,
      name: "Product 1",
      description: "Description of Product 1",
      price: 1000,
      quantity: 1,
    },
    // Add more products as needed
  ];

  return;
};

export default CheckoutPage;

// async function loadCheckoutData() {
//   const csrfToken = await getCSRFToken();

//   const resData = await fetch("http://localhost:5000/checkout", {
//     headers: {
//       "X-CSRF-Token": csrfToken,
//     },
//     credentials: "include",
//   });
//   const checkoutData = await resData.json();

//   return checkoutData;
// }

// export function loader() {
//   return defer({
//     checkoutData: loadCheckoutData(),
//   });
// }

// import React, { Suspense } from "react";
// import { Await, useLoaderData, Form, redirect, Link } from "react-router-dom";
// import ErrorPage from "../layouts/ErrorPage";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { PaymentElement } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(
//   "pk_test_51MM08RSARoTdkEygCUfdGYs2XOxONndFij0XXSWBcyGZBHAuOsa8ZyaNMzDLayqcVJmqufCcxpp9qJ2HWGgrVQ9H0050SA7Gov"
// );

// const CheckoutPage = () => {
//   // const { shoppingBag: checkoutData } = useLoaderData();
//   const options = {
//     clientSecret:
//       "sk_test_51MM08RSARoTdkEyg0BxRBlmAb8jsdpzebSepcdV7f6IeMpcdSMZ2t2HFZKLDspp0t4bGbN5aodGzpE9r7Y0A6pmu006ZMOpoQR",
//   };

//   return (
//     <Elements stripe={stripePromise} options={options}>
//       <form>
//         <PaymentElement />
//         <button>Submit</button>
//       </form>
//     </Elements>
//   );

//   // return (
//   //   <div>
//   //     <Suspense>
//   //       <Await resolve={checkoutData} errorElement={<ErrorPage />}>
//   //         {(checkoutDetails) => {
//   //           if (!checkoutDetails || checkoutDetails?.items.length === 0) {
//   //             return redirect("/shoppingBag");
//   //           }
//   //           return (
//   //             <div className="flex w-full justify-center mt-6">
//   //               <div className="pointer-events-auto border-2 rounded-md w-4/5 flex flex-col">
//   //                 <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 justify-center">
//   //                   <h1
//   //                     className="text-xl font-medium text-gray-900"
//   //                     id="slide-over-title"
//   //                   >
//   //                     Checkout Page
//   //                   </h1>
//   //                   <div className="flex justify-center">
//   //                     <div className="mt-8 w-11/12">
//   //                       <ul className="my-6 divide-y divide-gray-200 px-20">
//   //                         {checkoutDetails.items.map((item) => (
//   //                           <li
//   //                             className="flex py-6"
//   //                             key={item.productData._id}
//   //                           >
//   //                             <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
//   //                               <img
//   //                                 src={`http://localhost:5000/${item.productData.image}`}
//   //                                 alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
//   //                                 className="h-full w-full object-cover object-center"
//   //                               />
//   //                             </div>

//   //                             <div className="ml-4 flex flex-1 flex-col">
//   //                               <div>
//   //                                 <div className="flex justify-between text-base font-medium text-gray-900">
//   //                                   <h3>
//   //                                     <Link to="#">
//   //                                       {item.productData.title}
//   //                                     </Link>
//   //                                   </h3>
//   //                                   <p className="ml-4">
//   //                                     Rs. {item.productData.price}
//   //                                   </p>
//   //                                 </div>
//   //                                 <p className="mt-1 text-sm text-gray-500">
//   //                                   {item.description}
//   //                                 </p>
//   //                               </div>
//   //                               <div className="flex flex-1 items-end justify-between text-sm">
//   //                                 <p className="text-gray-500">
//   //                                   Qty x {item.quantity}
//   //                                 </p>
//   //                               </div>
//   //                             </div>
//   //                           </li>
//   //                         ))}
//   //                       </ul>
//   //                     </div>
//   //                   </div>
//   //                 </div>
//   //                 <div className="flex justify-center items-center">
//   //                   <div className="border-t border-gray-200 w-4/5 px-4 py-6 sm:px-6">
//   //                     <div className="flex justify-between text-base font-medium text-gray-900">
//   //                       <p>Total</p>
//   //                       <p>Rs. {checkoutDetails.totalPrice}</p>
//   //                     </div>
//   //                     <div className="mt-6 flex-1 ">
//   //                       <Form method="POST">
//   //                         <input
//   //                           type="hidden"
//   //                           name="bagId"
//   //                           value={checkoutDetails.id}
//   //                         />
//   //                         <button
//   //                           className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-2 py-3 mx-40 w-3/4 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
//   //                           type="submit"
//   //                         >
//   //                           Order Now!
//   //                         </button>
//   //                       </Form>
//   //                     </div>
//   //                   </div>
//   //                 </div>
//   //               </div>
//   //             </div>
//   //           );
//   //         }}
//   //       </Await>
//   //     </Suspense>
//   //   </div>
//   // );
// };

// export default CheckoutPage;
