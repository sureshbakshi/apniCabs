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
    request_id: null,
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
    setDrivers: (state, action) => {
      // Handle accepting a request and update activeRide
      state.request_id = action.payload?.request_id;
      const data = _.groupBy(action.payload, 'type');
      const sortedData = {};
      Object.keys(data).map(key => {
        sortedData[key] = _.sortBy(data[key], 'price');
      });
      state.drivers = sortedData;
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
      // Handle accepting a request and update activeRide
      // find updated driver request -- vehicle_id
      state.drivers = action.payload.request_id;
    },
    // Add other actions and reducers
  },
});

export const {
  sendRequest,
  cancelRequest,
  acceptRequest,
  setDrivers,
  updateDriversRequest,
  setActiveRide,
  cancelActiveRide,
} = userSlice.actions;

export default userSlice.reducer;
