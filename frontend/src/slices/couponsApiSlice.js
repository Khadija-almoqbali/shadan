import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// Base query
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const couponsApiSlice = createApi({
  reducerPath: "couponsApi",
  baseQuery,
  tagTypes: ["Coupon"],

  endpoints: (builder) => ({

    // =========================
    // GET ALL COUPONS
    // =========================
    getCoupons: builder.query({
      query: () => "/api/coupons",
      providesTags: ["Coupon"],
    }),

    // =========================
    // CREATE COUPON (ADMIN)
    // =========================
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/api/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),

    // =========================
    // DELETE COUPON (ADMIN)
    // =========================
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),

    // =========================
    // VALIDATE COUPON (CART)
    // =========================
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: "/api/coupons/validate",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

// =========================
// EXPORT HOOKS
// =========================
export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
} = couponsApiSlice;