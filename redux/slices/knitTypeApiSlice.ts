import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const knitTypeApiSlice = createApi({
  reducerPath: 'knitTypeApi',
  baseQuery: fetchBaseQuery({ baseUrl:  'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['KnitType'],
  endpoints: (builder) => ({
    getKnitTypes: builder.query({
      query: () => 'knittype/route',
      providesTags: ['KnitType'],
    }),
    getKnitTypeById: builder.query({
      query: (id) => `knittype/${id}`,
      providesTags: ['KnitType'],
    }),
    getDeletedKnitTypes: builder.query({
      query: () => 'knittype/bin',
      providesTags: ['KnitType'],
    }),
    addKnitType: builder.mutation({
      query: (newKnitType) => ({
        url: 'knittype/route',
        method: 'POST',
        body: newKnitType,
      }),
      invalidatesTags: ['KnitType'],
    }),
    updateKnitType: builder.mutation({
      query: (updatedKnitType) => ({
        url: `knittype/${updatedKnitType.id}`,
        method: 'PUT',
        body: updatedKnitType,
      }),
      invalidatesTags: ['KnitType'],
    }),
    deleteKnitType: builder.mutation({
      query: (id) => ({
        url: `knittype/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetKnitTypesQuery,
  useGetKnitTypeByIdQuery,
  useGetDeletedKnitTypesQuery,
  useAddKnitTypeMutation,
  useUpdateKnitTypeMutation,
  useDeleteKnitTypeMutation,
} = knitTypeApiSlice;
