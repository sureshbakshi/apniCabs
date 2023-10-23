import { createSlice } from '@reduxjs/toolkit';

const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    // Define driver state here
    driverRequests: [],
    activeRide: null,
  },
  reducers: {
    receiveRequest: (state, action) => {
      // Handle receiving a request and update driverRequests
    },
    acceptRequest: (state, action) => {
      // Handle accepting a request and update activeRide
      state.activeRide = action.payload;
    },
    declineRequest: (state) => {
      // Handle declining a request and remove it from driverRequests
    },
    // Add other actions and reducers
  },
});

export const { receiveRequest, acceptRequest, declineRequest } = driverSlice.actions;

export default driverSlice.reducer;
