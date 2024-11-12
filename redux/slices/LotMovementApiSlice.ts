import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const lotMovementApiSlice = createApi({
  reducerPath: 'lotMovementApi',
  baseQuery: fetchBaseQuery({ baseUrl:  'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['LotMovement'],
  endpoints: (builder) => ({
    // Read: Fetch all active lot movements
    getLotMovements: builder.query({
      query: () => 'lotMovement/route',
      providesTags: ['LotMovement'],
    }),
    // Fetch a single lot movement by ID
    getLotMovementById: builder.query({
      query: (id) => `lotMovement/${id}`,
      providesTags: ['LotMovement'],
    }),
    // Fetch all deleted lot movements
    getDeletedLotMovements: builder.query({
      query: () => 'lotMovement/bin',
      providesTags: ['LotMovement'],
    }),
    // Create a new lot movement
    addLotMovement: builder.mutation({
      query: (newLotMovement) => ({
        url: 'lotMovement/route',
        method: 'POST',
        body: newLotMovement,
      }),
      invalidatesTags: ['LotMovement'],
    }),
    // Update an existing lot movement
    updateLotMovement: builder.mutation({
      query: (updatedLotMovement) => ({
        url: `lotMovement/${updatedLotMovement.id}`,
        method: 'PUT',
        body: updatedLotMovement,
      }),
      invalidatesTags: ['LotMovement'],
    }),
    // Delete (soft delete) a lot movement by ID
    deleteLotMovement: builder.mutation({
      query: (id) => ({
        url: `lotMovement/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LotMovement'],
    }),
  }),
});

export const {
  useGetLotMovementsQuery,
  useGetLotMovementByIdQuery,
  useGetDeletedLotMovementsQuery,
  useAddLotMovementMutation,
  useUpdateLotMovementMutation,
  useDeleteLotMovementMutation,
} = lotMovementApiSlice;
