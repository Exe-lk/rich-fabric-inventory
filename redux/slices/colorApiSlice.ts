import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const colorApiSlice = createApi({
  reducerPath: 'colorApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['Color'],
  endpoints: (builder) => ({
    getColors: builder.query({
      query: () => 'color/route',
      providesTags: ['Color'],
    }),
    getColorById: builder.query({
      query: (id) => `color/${id}`,
      providesTags: ['Color'],
    }),
    getDeletedColors: builder.query({
      query: () => 'color/bin',
      providesTags: ['Color'],
    }),
    addColor: builder.mutation({
      query: (newColor) => ({
        url: 'color/route',
        method: 'POST',
        body: newColor,
      }),
      invalidatesTags: ['Color'],
    }),
    updateColor: builder.mutation({
      query: (updatedColor) => ({
        url: `color/${updatedColor.id}`,
        method: 'PUT',
        body: updatedColor,
      }),
      invalidatesTags: ['Color'],
    }),
    deleteColor: builder.mutation({
      query: (id) => ({
        url: `color/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetColorsQuery,
  useGetColorByIdQuery,
  useGetDeletedColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApiSlice;
