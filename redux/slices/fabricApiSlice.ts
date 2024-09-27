import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fabricApiSlice = createApi({
  reducerPath: 'fabricApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['Fabric'],
  endpoints: (builder) => ({
    getFabrics: builder.query({
      query: () => 'fabric/route',
      providesTags: ['Fabric'],
    }),
    getFabricById: builder.query({
      query: (id) => `fabric/${id}`,
      providesTags: ['Fabric'],
    }),
    getDeletedFabrics: builder.query({
      query: () => 'fabric/bin',
      providesTags: ['Fabric'],
    }),
    addFabric: builder.mutation({
      query: (newFabric) => ({
        url: 'fabric/route',
        method: 'POST',
        body: newFabric,
      }),
      invalidatesTags: ['Fabric'],
    }),
    updateFabric: builder.mutation({
      query: (updatedFabric) => ({
        url: `fabric/${updatedFabric.id}`,
        method: 'PUT',
        body: updatedFabric,
      }),
      invalidatesTags: ['Fabric'],
    }),
    deleteFabric: builder.mutation({
      query: (id) => ({
        url: `fabric/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetFabricsQuery,
  useGetFabricByIdQuery,
  useGetDeletedFabricsQuery,
  useAddFabricMutation,
  useUpdateFabricMutation,
  useDeleteFabricMutation,
} = fabricApiSlice;
