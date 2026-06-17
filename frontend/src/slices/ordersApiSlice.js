import { apiSlice } from "./apiSlice";
import { ORDERS_URL, AMWALPAY_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: {
          ...order,

          // ✅ FIX: normalize multilingual product names
          orderItems: order.orderItems.map((item) => ({
            ...item,
            name:
              typeof item.name === "object"
                ? item.name.en || item.name.ar
                : item.name,
          })),
        },
      }),
    }),

    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    getAmwalPayKey: builder.query({
      query: () => ({
        url: AMWALPAY_URL,
      }),
      keepUnusedDataFor: 60,
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    validateCoupon: builder.mutation({
      query: ({ code, total }) => ({
        url: "/api/coupons/validate",
        method: "POST",
        body: { code, total },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetAmwalPayKeyQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useValidateCouponMutation,
} = ordersApiSlice;