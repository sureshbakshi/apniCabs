import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.105:3000'}),
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    tagTypes: ['Users'],
  }),
});

export const {useGetUsersQuery} = apiSlice;
