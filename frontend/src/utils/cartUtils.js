export const addDecimals = (num) => {
  return Math.round(num * 100) / 100;
};

export const updateCart = (state) => {

  // تأكد من وجود discount دائمًا
  state.discount = Number(state.discount || 0);
  state.couponCode = state.couponCode || null;

  // Calculate items price (number)
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
    0.05 * state.itemsPrice
  );

  // Total price (with discount)
  const subtotal =
    state.itemsPrice +
    state.shippingPrice +
    state.taxPrice;

  state.totalPrice = addDecimals(
  subtotal - Math.min(state.discount, subtotal)
);

  // Get current user
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const cartKey = userInfo?._id
    ? `cart_${userInfo._id}`
    : "cart_guest";

  // مهم: تأكد أنك تحفظ كل شيء (بما فيه الخصم)
  localStorage.setItem(cartKey, JSON.stringify(state));

  return state;
};