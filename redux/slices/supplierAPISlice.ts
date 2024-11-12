import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const supplierApiSlice = createApi({
  reducerPath: 'supplierApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['Supplier'],
  endpoints: (builder) => ({
    // Fetch all suppliers
    getSuppliers: builder.query({
      query: () => 'supplier/route',
      providesTags: ['Supplier'],
    }),
    // Fetch a single supplier by ID
    getSupplierById: builder.query({
      query: (id) => `supplier/${id}`,
      providesTags: ['Supplier'],
    }),
    // Fetch deleted suppliers (status = false)
    getDeletedSuppliers: builder.query({
      query: () => 'supplier/bin',
      providesTags: ['Supplier'],
    }),
    // Add a new supplier
    addSupplier: builder.mutation({
      query: (newSupplier) => ({
        url: 'supplier/route',
        method: 'POST',
        body: newSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),
    // Update an existing supplier
    updateSupplier: builder.mutation({
      query: (updatedSupplier) => ({
        url: `supplier/${updatedSupplier.id}`,
        method: 'PUT',
        body: updatedSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),
    // Delete a supplier
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `supplier/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useGetDeletedSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApiSlice;
