import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { navigate } from '../util/navigationService';
import { ROUTES_NAMES } from '../constants';
import { clearAuthData } from './authSlice';
import { formatTransactions, getUserId, showErrorMessage } from '../util';
import { Platform } from 'react-native';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://apnicabi.com/api/',
  // baseUrl: 'http://192.168.0.103:3000/api/', //rajesh IP
  // baseUrl: 'http://192.168.150.226:8080/api/', //suresh IP
  prepareHeaders: (headers, { getState }) => {
    headers.set('Access-Control-Allow-Origin', `*`);
    headers.set('Access-Control-Allow-Headers', `*`);
    headers.set('Content-Type', `application/json`);
    if (getState().auth.access_token) {
      headers.set('Authorization', `${getState().auth.access_token}`);
    }
    if (getState().auth.device_token) {
      headers.set('device_token', `${getState().auth.device_token}`);
    }
    headers.set('device_type', Platform.os);
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log(JSON.stringify(args))

  let result = await baseQuery(args, api, extraOptions);
  console.log({ response: result?.data, uri: result?.meta?.response?.url, result })
  const err =  result?.error?.data?.error || result?.error
  if (err ) {
    showErrorMessage(err)
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
  transactions: path => `transactions/${path}`,
  sos: path => `sos/${path}`,
};
const api_urls = {
  login: 'login',
  signUp: 'user',
  forgot: 'forgot',
  verifyOTP: 'verifyOTP',
  userCheck: 'checkUser',
  driverAvailabilty: 'driver-availabilty',
  driverActiveRide: 'active-rides/driver',
  driverRideHistory: 'history/driver',
  userRideHistory: 'history/users',
  updateRequest: 'driver-update',
  send: 'send',
  ride: 'ride',
  completeRide: 'complete-ride',
  cancelAcceptedRequest: 'cancel-accpeted-request',
  location: 'location',
  userActiveRide: 'active-rides/user',
  list: 'list',
  cancelRequest: 'cancel-request',
  sosAdd: 'add',
  device: 'device'
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
    forgotPassword: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.public(api_urls.forgot),
        body,
      }),
      transformResponse: response => {
        return response;
      },
      transformErrorResponse: response => response,
    }),
    verifyOTP: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.public(api_urls.verifyOTP),
        body,
      }),
      transformResponse: response => {
        return response;
      },
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

    // users start
    userRideHistory: builder.query({
      query: () => ({
        method: 'GET',
        url: api_path.request(`${api_urls.userRideHistory}/${getUserId()}`),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      invalidatesTags: ["RideComplete"]
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
    sendDeviceToken: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.users(api_urls.device),
        body,
      }),
      transformResponse: response => {
        return response;
      },
      transformErrorResponse: response => response,
    }),

    // users end
    driverActiveRide: builder.query({
      query: () => ({
        method: 'GET',
        url: api_path.request(api_urls.driverActiveRide),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      providesTags: ['RideStatus', 'RideComplete'],
    }),
    driverRideHistory: builder.query({
      query: () => ({
        method: 'GET',
        url: api_path.request(`${api_urls.driverRideHistory}/${getUserId()}`),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      providesTags: ["RideStatus", "RideComplete"]
    }),
    userActiveRide: builder.query({
      query: () => ({
        method: 'GET',
        url: api_path.request(api_urls.userActiveRide),
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
      invalidatesTags: ['RideStatus']
    }),
    completeRideRequest: builder.mutation({
      query: body => ({
        method: 'PUT',
        url: api_path.request(api_urls.completeRide),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      invalidatesTags: ["RideComplete"]
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
    cancelRequest: builder.mutation({
      query: ({ request_id, driver_id }) => ({
        method: 'PUT',
        url: api_path.request(`${api_urls.cancelRequest}/${request_id}/${driver_id}`),
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
    cancelAllRequest: builder.mutation({
      query: (id) => ({
        method: 'DELETE',
        url: api_path.request(`${api_urls.cancelRequest}/${id}`),
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
    editFare: builder.mutation({
      query: ({ id, ...rest }) => ({
        method: "PUT",
        url: api_path.vehicle(`fair/${id}`),
        body: rest,
      }),
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (response) => response,
      invalidatesTags: ["FARE"]
    }),
    getVehicleTypes: builder.query({
      query: () => ({
        method: 'GET',
        url: api_path.vehicle('vehicle-types'),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    // transaction starts
    getDriverTransactions: builder.query({
      query: id => ({
        method: 'GET',
        url: api_path.transactions(`${api_urls.list}`),
      }),
      transformResponse: (response) => {
        const history = response
        if (history?.transactions) {
          const unholdTransactions = history.transactions.filter((item) => item.type !== 'HOLD')
          history.transactions = formatTransactions(unholdTransactions)
        }
        return history
      },
      transformErrorResponse: response => response,
      providesTags: ["RideStatus", "RideComplete"]
    }),
    // transaction end



    // request apis end
    getDriverDetails: builder.query({
      query: id => ({
        method: 'GET',
        url: api_path.drivers(id),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      providesTags: ["FARE"]
    }),
    getRideDetails: builder.query({
      query: id => ({
        method: 'GET',
        url: api_path.request(id),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    //SOS
    sosAdd: builder.mutation({
      query: ({ id, numbersList }) => ({
        method: 'POST',
        url: api_path.sos(`${api_urls.sosAdd}/${id}`),
        body: numbersList
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    sosList: builder.query({
      query: (id) => ({
        method: 'GET',
        url: api_path.sos(`${api_urls.list}/${id}`),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
  }),

  tagTypes: ['Token', 'RideComplete', "FARE", 'RideStatus'],
});

export const {
  useLoginMutation,
  useSingUpMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useUserCheckMutation,
  useSendRequestMutation,
  useUpdateRequestMutation,
  useSendDeviceTokenMutation,
  useUpdateDriverStatusMutation,
  useGetRideRequestMutation,
  useGetDriverDetailsQuery,
  useUpdateDriverLocationMutation,
  useLazyDriverActiveRideQuery,
  useRideRequestMutation,
  useCompleteRideRequestMutation,
  useCancelAcceptedRequestMutation,
  useLazyUserActiveRideQuery,
  useLazyDriverRideHistoryQuery,
  useLazyUserRideHistoryQuery,
  useLazyGetDriverTransactionsQuery,
  useEditFareMutation,
  useCancelRequestMutation,
  useCancelAllRequestMutation,
  useSosAddMutation,
  useSosListQuery,
  useGetVehicleTypesQuery,
  useGetRideDetailsQuery,
} = apiSlice;
