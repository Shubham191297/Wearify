import { getCSRFToken } from "../context/auth";
import { serverURL } from "../utils/backendURL";

export const loadGuestShoppingBag = () => {
  const guestShoppingBagEmpty = !sessionStorage.getItem("guestShoppingBag");

  if (guestShoppingBagEmpty) {
    const emptyBag = {
      items: [],
      totalPrice: 0,
    };
    sessionStorage.setItem("guestShoppingBag", JSON.stringify(emptyBag));
    return emptyBag;
  } else {
    const guestShoppingBagData = JSON.parse(
      sessionStorage.getItem("guestShoppingBag")
    );
    return guestShoppingBagData;
  }
};

export const addItemToGuestBag = (productId) => {
  const products = JSON.parse(sessionStorage.getItem("products"));

  const guestBag = loadGuestShoppingBag();

  const productToBeAdded = products.find(
    (product) => product._id === productId
  );

  const bagItem = guestBag.items.find(
    (item) => item.productData._id === productToBeAdded._id
  );

  if (bagItem) {
    bagItem.quantity = bagItem.quantity + 1;
  } else {
    guestBag.items.push({ productData: productToBeAdded, quantity: 1 });
  }

  guestBag.totalPrice = guestBag.totalPrice + +productToBeAdded.price;

  sessionStorage.setItem("guestShoppingBag", JSON.stringify(guestBag));
};

export const removeItemFromGuestBag = (productId) => {
  const products = JSON.parse(sessionStorage.getItem("products"));
  const guestBag = loadGuestShoppingBag();

  const productToBeAdded = products.find(
    (product) => product._id === productId
  );

  const bagItem = guestBag.items.find(
    (item) => item.productData._id === productToBeAdded._id
  );

  if (bagItem.quantity > 1) {
    bagItem.quantity = bagItem.quantity - 1;
  } else {
    guestBag.items = guestBag.items.filter(
      (item) => item.productData._id !== productToBeAdded._id
    );
  }

  guestBag.totalPrice = guestBag.totalPrice - +productToBeAdded.price;

  sessionStorage.setItem("guestShoppingBag", JSON.stringify(guestBag));
};

export const mergeGuestShoppingBag = async (guestBagData) => {
  const csrfToken = await getCSRFToken();
  const res = await fetch(`${serverURL}shoppingBag`, {
    method: "PUT",
    body: JSON.stringify({ guestBagData }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
  });
  const mergedBag = await res.json();
  sessionStorage.setItem(
    "guestShoppingBag",
    JSON.stringify({ items: [], totalPrice: 0 })
  );
  return mergedBag;
};
