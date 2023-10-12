import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: 'https://apnicabi.com/api'}),
  endpoints: builder => ({
    login: builder.mutation({
      query: ({email, password}) => ({
        method: 'POST',
        url: `/login?email=${email}&password=${password}`,
      }),
      transformResponse: response => response.data,
      invalidatesTags: ['Users'],
    }),
    singUp: builder.mutation({
      query: post => ({
        method: 'POST',
        url: `/register`,
        body: post,
      }),
      transformResponse: response => response.data,
      invalidatesTags: ['Users'],
    }),
    userCheck: builder.mutation({
      query: email => ({
        method: 'POST',
        url: `/user_check`,
        body: email,
      }),
      transformResponse: response => {
        console.log(response.data,response);
        return response.data;
      },
      invalidatesTags: ['Users'],
    }),
  }),
  tagTypes: ['Users'],
});

export const {useLoginMutation, useSingUpMutation, useUserCheckMutation} =
  apiSlice;
