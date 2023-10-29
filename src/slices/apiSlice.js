import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { navigate } from '../util/navigationService';
import { ROUTES_NAMES } from '../constants';
import { clearAuthData } from './authSlice';

const baseQuery =  fetchBaseQuery({
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
})
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
       api.dispatch(clearAuthData())
       
    // try to get a new token
    // const refreshResult = await baseQuery('/refreshToken', api, extraOptions)
    // if (refreshResult.data) {
    //   // store the new token
    //   api.dispatch(tokenReceived(refreshResult.data))
    //   // retry the initial query
    //   result = await baseQuery(args, api, extraOptions)
    // } else {
    //   api.dispatch(loggedOut())
    // }
  }
  return result
}

export const apiSlice = createApi({
  reducerPath: 'apiReducer',
  baseQuery:baseQueryWithReauth,
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
    getDriver: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: `drivers`,
        body
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      invalidatesTags: ['Token'],
    }),
    updateDriverStatus: builder.query({
      query: (status) => ({
        method: 'POST',
        url: `driverStatus`,
        body:{active: status}
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      invalidatesTags: ['send_request'],
    }),
    sendRequest: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: `sendRequest`,
        body
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      invalidatesTags: ['send_request'],
    }),
  }),
  tagTypes: ['Token', 'send_request'],
});

export const {
  useLoginMutation,
  useSingUpMutation,
  useUserCheckMutation,
  useProfileMutation,
  useGetDriverMutation,
  useSendRequestMutation
} = apiSlice;
