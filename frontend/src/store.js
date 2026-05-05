import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from './slices/apiSlice';

const store = configureStore({
  reducer: {
    // Add your reducers here - opject 
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;