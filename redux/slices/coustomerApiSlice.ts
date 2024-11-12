import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customerApiSlice = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://richfabricinventory.netlify.app/api/'}),
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    // Fetch all active customers
    getCustomers: builder.query({
      query: () => 'customer/route',
      providesTags: ['Customer'],
    }),
    // Fetch a single customer by ID
    getCustomerById: builder.query({
      query: (id) => `customer/${id}`,
      providesTags: ['Customer'],
    }),
    // Fetch all deleted customers
    getDeletedCustomers: builder.query({
      query: () => 'customer/bin',
      providesTags: ['Customer'],
    }),
    // Add a new customer
    addCustomer: builder.mutation({
      query: (newCustomer) => ({
        url: 'customer/route',
        method: 'POST',
        body: newCustomer,
      }),
      invalidatesTags: ['Customer'],
    }),
    // Update an existing customer
    updateCustomer: builder.mutation({
      query: (updatedCustomer) => ({
        url: `customer/${updatedCustomer.id}`,
        method: 'PUT',
        body: updatedCustomer,
      }),
      invalidatesTags: ['Customer'],
    }),
    // Delete a customer
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useGetDeletedCustomersQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApiSlice;
