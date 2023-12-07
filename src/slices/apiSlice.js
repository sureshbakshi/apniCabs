import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { navigate } from '../util/navigationService';
import { ROUTES_NAMES } from '../constants';
import { clearAuthData } from './authSlice';
import { showErrorMessage } from '../util';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://www.apnicabi.com/api/',
  // baseUrl: 'http://192.168.0.102:3000/api/', //rajesh IP
  // baseUrl: 'http://192.168.0.101:8080/api/', //suresh IP
  prepareHeaders: (headers, { getState }) => {
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
  console.log(JSON.stringify(args))

  let result = await baseQuery(args, api, extraOptions);
  console.log(JSON.stringify(result))
  if (result?.error) {
    showErrorMessage(result.error)
  }
  if (result.error && result.error.status === 401) {
    console.log(result.error)
    api.dispatch(clearAuthData());
    navigate(ROUTES_NAMES.signIn);
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
  public: path => `openApi/${path}`,
  users: path => `users/${path}`,
  drivers: path => `drivers/${path}`,
  vehicle: path => `vehicle/${path}`,
  request: path => `request/${path}`,
};
const api_urls = {
  login: 'login',
  signUp: 'user',
  userCheck: 'checkUser',
  driverAvailabilty: 'driver-availabilty',
  driverActiveRide: 'active-rides/driver',
  updateRequest: 'driver-update',
  send: 'send',
  ride: 'ride',
  completeRide: 'complete-ride',
  cancelAcceptedRequest: 'cancel-accpeted-request',
  location: 'location'
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
    }),
    singUp: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.public(api_urls.signUp),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    userCheck: builder.mutation({
      query: email => ({
        method: 'POST',
        url: api_path.public(api_urls.userCheck),
        body: { email },
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    getRideRequest: builder.mutation({
      query: body => ({
        method: 'POST',
        url: `request/create`,
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    updateDriverStatus: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.drivers(api_urls.driverAvailabilty),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    // request Apis
    sendRequest: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.request(api_urls.send),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    driverActiveRide: builder.query({
      query: () => ({
        method: 'GET',
        url: api_path.request(api_urls.driverActiveRide),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    rideRequest: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.request(api_urls.ride),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    completeRideRequest: builder.mutation({
      query: body => ({
        method: 'PUT',
        url: api_path.request(api_urls.completeRide),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    cancelAcceptedRequest: builder.mutation({
      query: body => ({
        method: 'PUT',
        url: api_path.request(api_urls.cancelAcceptedRequest),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    updateRequest: builder.mutation({
      query: body => ({
        method: 'PUT',
        url: api_path.request(api_urls.updateRequest),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    updateDriverLocation: builder.mutation({
      query: body => ({
        method: 'PUT',
        url: api_path.drivers(`${api_urls.location}/${body.driver_id}`),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),



    // request apis end
    getDriverDetails: builder.query({
      query: id => ({
        method: 'GET',
        url: api_path.drivers(id),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
  }),

  tagTypes: ['Token'],
});

export const {
  useLoginMutation,
  useSingUpMutation,
  useUserCheckMutation,
  useSendRequestMutation,
  useUpdateRequestMutation,
  useUpdateDriverStatusMutation,
  useGetRideRequestMutation,
  useGetDriverDetailsQuery,
  useUpdateDriverLocationMutation,
  useDriverActiveRideQuery,
  useRideRequestMutation,
  useCompleteRideRequestMutation,
  useCancelAcceptedRequestMutation
} = apiSlice;
