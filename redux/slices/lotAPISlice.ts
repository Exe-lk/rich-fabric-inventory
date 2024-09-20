import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const lotApiSlice = createApi({
  reducerPath: 'lotApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['Lot'],
  endpoints: (builder) => ({
    // Fetch all lots
    getLots: builder.query({
      query: () => 'lot/route',
      providesTags: ['Lot'],
    }),
    // Fetch a single lot by ID
    getLotById: builder.query({
      query: (id) => `lot/${id}`,
      providesTags: ['Lot'],
    }),
    // Fetch deleted lots (status = false)
    getDeletedLots: builder.query({
      query: () => 'lot/bin',
      providesTags: ['Lot'],
    }),
    // Add a new lot
    addLot: builder.mutation({
      query: (newLot) => ({
        url: 'lot/route',
        method: 'POST',
        body: newLot,
      }),
      invalidatesTags: ['Lot'],
    }),
    // Update an existing lot
    updateLot: builder.mutation({
      query: (updatedLot) => ({
        url: `lot/${updatedLot.id}`,
        method: 'PUT',
        body: updatedLot,
      }),
      invalidatesTags: ['Lot'],
    }),
    // Delete a lot
    deleteLot: builder.mutation({
      query: (id) => ({
        url: `lot/${id}`,
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
} = lotApiSlice;
