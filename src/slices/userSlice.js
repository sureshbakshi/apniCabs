import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    // Define user state here
    userRequests: [],
    activeRideInfo: null,
    activeRideId: null,
    drivers: [],
    rideRequests: null,
  },
  reducers: {
    sendRequest: (state, action) => {
      // Handle sending a request and update userRequests
    },
    cancelRequest: state => {
      // Handle canceling a request and update userRequests
    },
    acceptRequest: (state, action) => {
      // Handle accepting a request and update activeRide
      state.activeRide = action.payload;
    },
    setRideRequest: (state, action) => {
      // Handle accepting a request and update activeRide
      state.rideRequests = action.payload;
    },
    setActiveRide: (state, action) => {
      // Handle accepting a request and update activeRide
      state.activeRideId = action.payload.data.active_ride_id;
      state.activeRideInfo = action.payload.data;
    },
    cancelActiveRide: (state, action) => {
      // Handle accepting a request and update activeRide
      state.activeRideId = null;
      state.activeRideInfo = null;
    },
    updateDriversRequest: (state, action) => {
      const {driver_id, status} = action.payload;
      const existingVehicleList = JSON.parse(
        JSON.stringify(state.rideRequests.vehicles),
      );
      existingVehicleList.map(item => {
        _.map(item.drivers, item => {
          if (item.driver_id === driver_id) {
            item.status = status;
          }
        });
      });
      state.rideRequests.vehicles = existingVehicleList;
    },
    // Add other actions and reducers
  },
});

export const {
  sendRequest,
  cancelRequest,
  acceptRequest,
  setRideRequest,
  updateDriversRequest,
  setActiveRide,
  cancelActiveRide,
} = userSlice.actions;

export default userSlice.reducer;
