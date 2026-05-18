export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    )
  );

  // Shipping price
  state.shippingPrice = addDecimals(
    state.itemsPrice > 100 ? 0 : 2
  );

  // Tax price
  state.taxPrice = addDecimals(
    Number((0.05 * state.itemsPrice).toFixed(2))
  );

  // Total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Get current user
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  // Create unique cart key
  const cartKey = userInfo?._id
    ? `cart_${userInfo._id}`
    : "cart_guest";

  // Save cart per user
  localStorage.setItem(cartKey, JSON.stringify(state));

  return state;
};