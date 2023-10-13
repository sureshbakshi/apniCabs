import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { navigate } from '../util/navigationService';
import { ROUTES_NAMES } from '../constants';

export const apiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.apnicabi.com/api/',
    prepareHeaders:( headers,{getState} )=> {
      headers.set('Access-Control-Allow-Origin', `*`);
      headers.set('Access-Control-Allow-Headers', `*`);
      headers.set('Content-Type', `application/json`);
      if(getState().auth.token){
        headers.set('Authorization', `Bearer ${getState().auth.token}`)
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: body => ({
        method: 'POST',
        url: `login`,
        body,
      }),
      transformResponse: response => {
        return response;
      },
      transformErrorResponse: response => response,
      providesTags: ['Token'],
    }),
    singUp: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: `register`,
        body
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      providesTags: ['Token'],
    }),
    userCheck: builder.mutation({
      query: email => ({
        method: 'POST',
        url: `user_check`,
        body: {email},
      }),
      transformResponse: response => {
        if(!response.user){
          navigate(ROUTES_NAMES.signUp)
        }
        return response;
      },
      transformErrorResponse: response => response,
      providesTags: ['Token'],
    }),
    profile: builder.mutation({
      query: () => ({
        method: 'POST',
        url: `profile`,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      invalidatesTags: ['Token'],
    }),
  }),
  tagTypes: ['Token'],
});

export const {
  useLoginMutation,
  useSingUpMutation,
  useUserCheckMutation,
  useProfileMutation,
} = apiSlice;
