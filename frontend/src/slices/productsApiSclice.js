import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // ✅ Get all products
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5,
        }),

        // ✅ Get single product
        getProductDetails: builder.query({
            query: (productId) => `${PRODUCTS_URL}/${productId}`,
            keepUnusedDataFor: 5,
            providesTags: ['Product'],
        }),

        // ✅ Create product (FIXED for multilingual fields)
        createProduct: builder.mutation({
            query: (data) => ({
                url: PRODUCTS_URL,
                method: 'POST',
                body: data,   // 🔥 مهم جداً الآن
            }),
            invalidatesTags: ['Products'],
        }),

        // ✅ Update product (supports ar/en objects)
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data._id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products', 'Product'],
        }),

        // ✅ Upload image
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data,
            }),
        }),

        // ✅ Delete product
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),

        // ✅ Create review
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),

    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation
} = productsApiSlice;