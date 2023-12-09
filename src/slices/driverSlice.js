import { createSlice, current } from '@reduxjs/toolkit';
import { navigate } from '../util/navigationService';
import { DriverAvailableStatus, ROUTES_NAMES, RideStatus } from '../constants';
import { activeReq, requestObj } from '../mock/activeRequest';


const initialState = {
  rideRequests: [],
  activeRequest: null,
  activeRideId: null,
  isOnline: false
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
        state.activeRideId = requestObj.status === RideStatus.ONRIDE ? requestObj.id : state.activeRideId
      } else {
        
        console.log(current(state.rideRequests))
        state.rideRequests = state.rideRequests.filter((request) => requestObj.id !== request.id)
      }
    },
    setActiveRide: (state, action) => {
      const { id } = action.payload || {}
      state.activeRideId = id;
    },
    updateRideStatus: (state, action) => {
      const { status } = action.payload || {}
      if (status === RideStatus.USER_CANCELLED || status === RideStatus.DRIVER_CANCELLED || status === RideStatus.COMPLETED) {
        return Object.assign(state, { ...initialState, isOnline: state.isOnline })
      }
    },
    setDriverStatus: (state, action) => {
      const status = action.payload?.is_available
      if (status) {
        state.isOnline = status;
      }
    },
    setRideRequest: (state, action) => {
      state.rideRequests = [...state.rideRequests, action.payload];
    },

  },
});

export const { updateRideRequest, setActiveRide, setDriverStatus, setRideRequest, updateRideStatus } = driverSlice.actions;

export default driverSlice.reducer;
