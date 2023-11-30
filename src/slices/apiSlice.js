import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {navigate} from '../util/navigationService';
import {ROUTES_NAMES} from '../constants';
import {clearAuthData} from './authSlice';

const baseQuery = fetchBaseQuery({
  // baseUrl: 'https://www.apnicabi.com/',
  baseUrl: "http://localhost:3000/",
  prepareHeaders: (headers, {getState}) => {
    headers.set('Access-Control-Allow-Origin', `*`);
    headers.set('Access-Control-Allow-Headers', `*`);
    headers.set('Content-Type', `application/json`);
    if (getState().auth.access_token) {
      headers.set('Authorization', `${getState().auth.access_token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(clearAuthData());
    navigate(ROUTES_NAMES.signIn)
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
  return result;
};

const api_path = {
  public: (path) => `openApi/${path}`,
  users: (path) => `users/${path}`,
  drivers: (path) => `drivers/${path}`,
  vehicle: (path) => `vehicle/${path}`,
};
const api_urls = {
  login: "login",
  signUp: "user",
  userCheck: "checkUser",
  driverAvailabilty: "driver-availabilty",
};

export const apiSlice = createApi({
  reducerPath: 'apiReducer',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    login: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.public(api_urls.login),
        body,
      }),
      transformResponse: response => {
        return response;
      },
      transformErrorResponse: response => response,
      providesTags: ['Token'],
    }),
    singUp: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.public(api_urls.signUp),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      providesTags: ['Token'],
    }),
    userCheck: builder.mutation({
      query: email => ({
        method: 'POST',
        url: api_path.public(api_urls.userCheck),
        body: {email},
      }),
      transformResponse: response => {
        if (!response.user) {
          navigate(ROUTES_NAMES.signUp);
        }
        return response;
      },
      transformErrorResponse: response => response,
      providesTags: ['Token'],
    }),
    getDriver: builder.mutation({
      query: body => ({
        method: 'POST',
        url: `drivers`,
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      invalidatesTags: ['Token'],
    }),
    updateDriverStatus: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.drivers(api_urls.driverAvailabilty),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      invalidatesTags: ['Token'],
    }),
    sendRequest: builder.mutation({
      query: ({request_id, vehicle_id}) => ({
        method: 'POST',
        url: `http://192.168.0.103:3000/sendRequest`,
        body: {
          request_id,
          vehicle_id,
        },
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
  useGetDriverMutation,
  useSendRequestMutation,
  useUpdateDriverStatusMutation
} = apiSlice;
