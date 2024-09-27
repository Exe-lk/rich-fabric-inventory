import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const gsmApiSlice = createApi({
  reducerPath: 'gsmApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://richfabricinventory.netlify.app/api/' }),
  tagTypes: ['GSM'],
  endpoints: (builder) => ({
    getGSMs: builder.query({
      query: () => 'gsm/route',
      providesTags: ['GSM'],
    }),
    getGSMById: builder.query({
      query: (id) => `gsm/${id}`,
      providesTags: ['GSM'],
    }),
    getDeletedGSMs: builder.query({
      query: () => 'gsm/bin',
      providesTags: ['GSM'],
    }),
    addGSM: builder.mutation({
      query: (newGSM) => ({
        url: 'gsm/route',
        method: 'POST',
        body: newGSM,
      }),
      invalidatesTags: ['GSM'],
    }),
    updateGSM: builder.mutation({
      query: (updatedGSM) => ({
        url: `gsm/${updatedGSM.id}`,
        method: 'PUT',
        body: updatedGSM,
      }),
      invalidatesTags: ['GSM'],
    }),
    deleteGSM: builder.mutation({
      query: (id) => ({
        url: `gsm/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetGSMsQuery,
  useGetGSMByIdQuery,
  useGetDeletedGSMsQuery,
  useAddGSMMutation,
  useUpdateGSMMutation,
  useDeleteGSMMutation,
} = gsmApiSlice;
