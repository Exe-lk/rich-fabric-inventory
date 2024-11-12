import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const stockOutApiSlice = createApi({
  reducerPath: 'stockOutApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['StockOut'],
  endpoints: (builder) => ({
    // Fetch all stock outs
    getStockOuts: builder.query({
      query: () => 'stockout/route',
      providesTags: ['StockOut'],
    }),
    // Fetch a single stock out by ID
    getStockOutById: builder.query({
      query: (id) => `stockout/${id}`,
      providesTags: ['StockOut'],
    }),
    // Fetch deleted stock outs (status = false)
    getDeletedStockOuts: builder.query({
      query: () => 'stockout/bin',
      providesTags: ['StockOut'],
    }),
    // Add a new stock out
    addStockOut: builder.mutation({
      query: (newStockOut) => ({
        url: 'stockout/route',
        method: 'POST',
        body: newStockOut,
      }),
      invalidatesTags: ['StockOut'],
    }),
    // Update an existing stock out
    updateStockOut: builder.mutation({
      query: (updatedStockOut) => ({
        url: `stockout/${updatedStockOut.id}`,
        method: 'PUT',
        body: updatedStockOut,
      }),
      invalidatesTags: ['StockOut'],
    }),
    // Delete a stock out
    deleteStockOut: builder.mutation({
      query: (id) => ({
        url: `stockout/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetStockOutsQuery,
  useGetStockOutByIdQuery,
  useGetDeletedStockOutsQuery,
  useAddStockOutMutation,
  useUpdateStockOutMutation,
  useDeleteStockOutMutation,
} = stockOutApiSlice;
