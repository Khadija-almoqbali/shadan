import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";


// Get logged in user
const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Create unique cart key for each user
const cartKey = userInfo?._id
  ? `cart_${userInfo._id}`
  : "cart_guest";

// Initial state
const initialState = localStorage.getItem(cartKey)
  ? JSON.parse(localStorage.getItem(cartKey))
  : {
      cartItems: [],
      shippingAddress: {deliveryType: "home"},
      paymentMethod: "AmwalPay",
      discount: 0,
      couponCode: null,
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
        const item = action.payload;

        if (!item.product && item._id) {
          item.product = item._id;
        }

        const existItem = state.cartItems.find((x) => x._id === item._id);

        if (existItem) {
          state.cartItems = state.cartItems.map((x) =>
            x._id === existItem._id ? item : x
          );
        } else {
          state.cartItems = [...state.cartItems, item];
        }

        updateCart(state);
      },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x._id !== action.payload
      );

      updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;

      updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;

      updateCart(state);
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      state.discount = 0;
      state.couponCode = null;

      updateCart(state);
    },

    savePhoneNumber: (state, action) => {
      state.shippingAddress = {
        ...state.shippingAddress,
        phoneNumber: action.payload,
      };

      updateCart(state);
    },

    loadCart: (state, action) => {
      return action.payload;
    },

    applyCoupon: (state, action) => {
      state.discount = action.payload.discount;
      state.couponCode = action.payload.couponCode;

      updateCart(state);
    },

    removeCoupon: (state) => {
      state.discount = 0;
      state.couponCode = null;

      updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  savePhoneNumber,
  loadCart,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;