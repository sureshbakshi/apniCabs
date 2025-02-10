import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { navigate } from '../util/navigationService';
import { ROUTES_NAMES } from '../constants';
import { clearAuthData } from './authSlice';
import { formatTransactions, getUserId, showErrorMessage } from '../util';

import { Platform } from 'react-native';

const baseQuery = fetchBaseQuery({
  // baseUrl: 'http://43.204.100.95:3001/',
  baseUrl: 'https://apnicabi.com/api/v1/',
  // baseUrl: 'http://192.168.0.104:8080/api/', //rajesh IP
  // baseUrl: 'http://192.168.29.235:8080/api/', //suresh IP
  prepareHeaders: (headers, { getState }) => {
    headers.set('Access-Control-Allow-Origin', `*`);
    headers.set('Access-Control-Allow-Headers', `*`);
    headers.set('Content-Type', `application/json`);
    headers.set('Accept', `application/json`);
    if (getState().auth.access_token) {
      headers.set('Authorization', `Bearer ${getState().auth.access_token}`);
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
  const err = result?.error?.data?.error || result?.error
  if (err) {
    showErrorMessage(err)
  }
  if (result.error && result.error.status === 401) {
    console.log(result.error)
    api.dispatch(clearAuthData());
    setTimeout(() => {
      navigate(ROUTES_NAMES.signIn);
    }, 100)
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
  public: path => `auth/auth/${path}`,
  users: path => `user/user/${path}`,
  drivers: path => `driver-vehicle/driver/${path}`,
  vehicle: path => `driver-vehicle/vehicle/${path}`,
  request: path => `request/request/${path}`,
  transactions: path => `transactions/${path}`,
  subscription: path => `subscription/${path}`,
  payment: path => `payment/${path}`,
  sos: path => `sos/${path}`,
  links: path => `links/${path}`,
  location: path => `location/location/${path}`,
  wallet: path => `payment/wallet/${path}`
};
const api_urls = {
  login: 'login',
  loginOTP: 'loginOTP',
  signUp: 'register',
  signupOTP: 'registerOTP',
  forgot: 'forgot',
  verifyOTP: 'verifyOTP',
  userCheck: 'checkUser',
  driverAvailabilty: 'driver-availabilty',
  driverActiveRide: 'active-rides/driver',
  driverRideHistory: 'history/driver',
  userRideHistory: 'history/user',
  updateRequest: 'driver-update',
  send: 'send',
  ride: 'ride',
  completeRide: 'complete-ride',
  cancelAcceptedRequest: 'cancel-accpeted-request',
  location: 'location',
  userActiveRide: 'active/user',
  list: 'list',
  cancelRequest: 'cancel-request',
  sosAdd: 'add',
  device: 'device',
  order: 'order',
  payment: 'payment',
  wallet: 'wallet',
  create: 'create'
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
    getLoginOTP: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.public(api_urls.loginOTP),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    signup: builder.mutation({
      query: ({ user_type, ...body }) => ({
        method: 'POST',
        url: api_path.public(`${api_urls.signUp}/${user_type}`),
        body,
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    getSignupOTP: builder.mutation({
      query: body => ({
        method: 'POST',
        url: api_path.public(api_urls.signupOTP),
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
        url: api_path.request(api_urls.create),
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
      query: ({ page, pageSize }) => ({
        method: 'GET',
        url: api_path.request(`${api_urls.userRideHistory}?pageNumber=${page}&pageSize=${pageSize}`),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      providesTags: ["RideComplete"]
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
      providesTags: ['RideStatus'],
    }),
    driverRideHistory: builder.query({
      query: ({ page, pageSize }) => ({
        method: 'GET',
        url: api_path.request(`${api_urls.driverRideHistory}?pageNumber=${page}&pageSize=${pageSize}`),
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
        url: api_path.vehicle('types'),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    // transaction starts
    getDriverTransactions: builder.query({
      query: ({ id, page, pageSize, lastKey }) => ({
        method: 'GET',
        url: api_path.wallet(`${id}/transactions?pageNumber=${page}&pageSize=${pageSize}`),
      }),
      transformResponse: response => response,
      // transformResponse: (response) => {
      //   const history = response
      //   if (history?.transactions) {
      //     const unholdTransactions = history.transactions.filter((item) => item.type !== 'HOLD')
      //     history.transactions = formatTransactions(unholdTransactions)
      //   }
      //   return history
      // },
      transformErrorResponse: response => response,
      providesTags: ["RideStatus", "RideComplete"]
    }),
    getDriverWallet: builder.query({
      query: id => ({
        method: 'GET',
        url: api_path.transactions(`${api_urls.wallet}`),
      }),
      transformResponse: response => response,
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
    //subscription
    subscriptionList: builder.query({
      query: () => ({
        method: 'GET',
        url: api_path.subscription(`${api_urls.list}`),
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    //subscription end

    //payment start
    // createOrder: builder.mutation({
    //   query: ({user_id, id}) => ({
    //     method: 'POST',
    //     url: api_path.subscription(`${api_urls.order}/${user_id}/${id}`),
    //   }),
    //   transformResponse: response => response,
    //   transformErrorResponse: response => response,
    // }),
    createOrder: builder.mutation({
      query: (body) => ({
        method: 'POST',
        url: api_path.payment(api_urls.order),
        body: body
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
    }),
    //payment end
    //appLinks
    getAppLinks: builder.query({
      query: (body) => ({
        method: 'GET',
        url: api_path.links(api_urls.list),
        params: body
      }),
      transformResponse: response => response,
      transformErrorResponse: response => response,
      providesTags: ['AppLinks']
    }),
    //appLinks end

  }),

  tagTypes: ['Token', 'RideComplete', "FARE", 'RideStatus', 'AppLinks'],
});

export const {
  useLoginMutation,
  useGetLoginOTPMutation,
  useSignupMutation,
  useGetSignupOTPMutation,
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
  useDriverRideHistoryQuery,
  useUserRideHistoryQuery,
  useLazyUserRideHistoryQuery,
  useGetDriverTransactionsQuery,
  useLazyGetDriverTransactionsQuery,
  useEditFareMutation,
  useCancelRequestMutation,
  useCancelAllRequestMutation,
  useSosAddMutation,
  useSosListQuery,
  useGetVehicleTypesQuery,
  useGetRideDetailsQuery,
  useSubscriptionListQuery,
  useLazyGetDriverWalletQuery,
  // useLazyCreateOrderQuery
  useCreateOrderMutation,
  useLazyGetAppLinksQuery,
} = apiSlice;
