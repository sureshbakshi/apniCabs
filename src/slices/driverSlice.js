import { createSlice, current } from '@reduxjs/toolkit';
import { ClearRideStatus, RideStatus } from '../constants';
import { isEmpty } from 'lodash'
import { formatRideRequest } from '../util';

const initialState = {
  rideRequests: [],
  activeRequestInfo: null,
  isOnline: true,
  statusUpdate: null,
  walletInfo: null,
}

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    updateRideRequest: (state, action) => {
      // on socket request, on accept and on decline
      const requestObj = action.payload
      if (requestObj.status === RideStatus.ACCEPTED || requestObj.status === RideStatus.ONRIDE) {
        state.activeRequestInfo = requestObj;
        state.rideRequests = []
      } else {
        state.rideRequests = state.rideRequests.filter((request) => (requestObj.request_id || requestObj.id)!== (request.request_id || request.id))
      }
    },
    setActiveRide: (state, action) => {
      // on active request api response and otp submit
      const requestObj = action.payload
      if (isEmpty(requestObj)) {
        state.activeRequestInfo = null;
      } else {
        const { id } = requestObj || {}
        state.activeRequestId = id;
        state.activeRequestInfo = requestObj
      }
    },
    updateRideStatus: (state, action) => {
      const { status } = action.payload || {}
      if (ClearRideStatus.includes(status)) {
        state.statusUpdate = {...state.activeRequestInfo, ...action.payload}
        state.activeRequestInfo = null;
      }
    },
    setDriverStatus: (state, action) => {
      const status = action.payload?.is_available || action.payload?.DriverDetail?.is_available
      if (status) {
        state.isOnline = status;
      }
    },

    clearDriverState: (state, action) => {
      return Object.assign(state, { ...initialState, isOnline: state.isOnline })
    },
    clearDriverRideStatus: (state, action) => {
      state.statusUpdate = null;
    },
    setRideRequest: (state, action) => {
      // on active requests api response and on request socket
      const newRequest = action.payload;
      let updatedRequest = state.rideRequests;
      if (Array.isArray(newRequest)) {
        if (newRequest?.length) {
          updatedRequest = newRequest
        } else {
          updatedRequest = []
          state.activeRequestInfo = null;
        }
      } else {
        updatedRequest = formatRideRequest(newRequest, state.rideRequests)
      }
      state.rideRequests = updatedRequest;
    },

    setDriverWallet: (state, action) => {
      state.walletInfo = action.payload;
    },
  },
});

export const { updateRideRequest, setActiveRide, setDriverStatus, setRideRequest, updateRideStatus, clearDriverState, clearDriverRideStatus, setDriverWallet } = driverSlice.actions;

export default driverSlice.reducer;
