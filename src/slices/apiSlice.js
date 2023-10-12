import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: 'https://apnicabi.com/api'}),
  endpoints: builder => ({
    login: builder.mutation({
      query: ({email, password}) => ({
        method: 'POST',
        url: `login?email=${email}&password=${password}`,
      }),
      transformResponse: response => response.data,
      invalidatesTags: ['Users'],
    }),
  }),
  tagTypes: ['Users'],
});

export const {useLoginMutation} = apiSlice;
