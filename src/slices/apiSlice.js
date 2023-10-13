import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.apnicabi.com/api/',
    prepareHeaders: (headers) => {
      headers.set('Access-Control-Allow-Origin', `*`)
      headers.set('Access-Control-Allow-Headers', `*`)
      headers.set('Content-Type', `application/json`)
      return headers
    }
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: `login`,
        body
      }),
      transformResponse: response => response,
      invalidatesTags: ['Users'],
    }),
    singUp: builder.mutation({
      query: post => ({
        method: 'POST',
        url: `register`,
        body: post,
      }),
      transformResponse: response => response,
      invalidatesTags: ['Users'],
    }),
    userCheck: builder.mutation({
      query: email => ({
        method: 'POST',
        url: `user_check`,
        body: email,
      }),
      transformResponse: response => {
        return response;
      },
      invalidatesTags: ['Users'],
    }),
  }),
  tagTypes: ['Users'],
});

export const { useLoginMutation, useSingUpMutation, useUserCheckMutation } =
  apiSlice;
