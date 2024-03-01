import { createSlice, current } from '@reduxjs/toolkit';
import { ClearRideStatus, RideStatus } from '../constants';
import { isEmpty } from 'lodash'
import { formatRideRequest } from '../util';

const initialState = {
  rideRequests: [],
  activeRequest: null,
  activeRideId: null,
  isOnline: false,
  statusUpdate: null
}

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    updateRideRequest: (state, action) => {
      const requestObj = action.payload
      if (requestObj.status === RideStatus.ACCEPTED || requestObj.status === RideStatus.ONRIDE) {
        state.activeRequest = requestObj;
        state.rideRequests = []
        state.activeRideId = requestObj.status === RideStatus.ONRIDE ? requestObj.id : null
      } else {
        state.rideRequests = state.rideRequests.filter((request) => requestObj.id !== request.id)
      }
    },
    setActiveRide: (state, action) => {
      const requestObj = action.payload
      if (isEmpty(requestObj)) {
        state.activeRequest = null;
        state.activeRideId = null;
      } else {
        const { id } = requestObj || {}
        state.activeRideId = requestObj.status === RideStatus.ONRIDE ? id : null;
        state.activeRequest = requestObj
      }
    },
    updateRideStatus: (state, action) => {
      const { status } = action.payload || {}
      if (ClearRideStatus.includes(status)) {
        state.statusUpdate = action.payload
      }
    },
    setDriverStatus: (state, action) => {
      const status = action.payload?.is_available || action.payload?.driver_detail?.is_available
      if (status) {
        state.isOnline = status;
      }
    },

    clearDriverState: (state, action) => {
      return Object.assign(state, { ...initialState, isOnline: state.isOnline })
    },
    setRideRequest: (state, action) => {
      const newRequest = action.payload;
      let updatedRequest = state.rideRequests;
      console.log({updatedRequest})
      if (Array.isArray(newRequest)) {
        if(newRequest.length) {
            updatedRequest = newRequest
        }else{
          updatedRequest = []
        }
      } else {
        updatedRequest = formatRideRequest(newRequest, state.rideRequests)
      }
      state.rideRequests = updatedRequest;
    },

  },
});

export const { updateRideRequest, setActiveRide, setDriverStatus, setRideRequest, updateRideStatus, clearDriverState } = driverSlice.actions;

export default driverSlice.reducer;
