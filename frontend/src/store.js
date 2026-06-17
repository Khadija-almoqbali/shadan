import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import { couponsApiSlice } from "./slices/couponsApiSlice";

import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    // API slices
    [apiSlice.reducerPath]: apiSlice.reducer,
    [couponsApiSlice.reducerPath]: couponsApiSlice.reducer,

    // Normal slices
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      couponsApiSlice.middleware
    ),

  devTools: true,
});

export default store;