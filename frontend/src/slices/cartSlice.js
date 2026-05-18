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
      shippingAddress: {},
      paymentMethod: "AmwalPay",
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find(
        (x) => x._id === item._id
      );

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

      updateCart(state);
    },

    savePhoneNumber: (state, action) => {
      state.shippingAddress = {
        ...state.shippingAddress,
        phoneNumber: action.payload,
      };

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
} = cartSlice.actions;

export default cartSlice.reducer;