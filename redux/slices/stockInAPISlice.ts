import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const lotInApiSlice = createApi({
  reducerPath: 'lotApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['Lot'],
  endpoints: (builder) => ({
    // Fetch all lots
    getLots: builder.query({
      query: () => 'stockin/route',
      providesTags: ['Lot'],
    }),
    // Fetch a single lot by ID
    getLotById: builder.query({
      query: (id) => `stockin/${id}`,
      providesTags: ['Lot'],
    }),
    // Fetch deleted lots (status = false)
    getDeletedLots: builder.query({
      query: () => 'stockin/bin',
      providesTags: ['Lot'],
    }),
    // Add a new lot
    addLot: builder.mutation({
      query: (newLot) => ({
        url: 'stockin/route',
        method: 'POST',
        body: newLot,
      }),
      invalidatesTags: ['Lot'],
    }),
    // Update an existing lot
    updateLot: builder.mutation({
      query: (updatedLot) => ({
        url: `stockin/${updatedLot.id}`,
        method: 'PUT',
        body: updatedLot,
      }),
      invalidatesTags: ['Lot'],
    }),
    // Delete a lot
    deleteLot: builder.mutation({
      query: (id) => ({
        url: `stockin/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetLotsQuery,
  useGetLotByIdQuery,
  useGetDeletedLotsQuery,
  useAddLotMutation,
  useUpdateLotMutation,
  useDeleteLotMutation,
} = lotInApiSlice;
