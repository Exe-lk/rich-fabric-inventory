import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApiSlice = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    // Read: Fetch all categories
    getCategories: builder.query({
      query: () => 'category/route',
      providesTags: ['Category'],
    }),
    // Fetch a single category by ID
    getCategoryById: builder.query({
      query: (id) => `category/${id}`,
      providesTags: ['Category'],
    }),
    getDeleteCategories: builder.query({
      query: () => 'category/bin',
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: 'category/route',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: (updatedCategory) => ({
        url: `category/${updatedCategory.id}`,
        method: 'PUT',
        body: updatedCategory,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery, // New hook to fetch single category
  useGetDeleteCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
