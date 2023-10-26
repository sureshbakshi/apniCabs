import { createSlice } from '@reduxjs/toolkit';
import { navigate } from '../util/navigationService';
import { ROUTES_NAMES } from '../constants';

const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    // Define driver state here
    driverRequests: [],
    isActiveRide: null,
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
    setRideStatus: (state, action) => {
      state.isActiveRide = action.payload;
      // navigate(ROUTES_NAMES.activeRide)
    }
    // Add other actions and reducers
  },
});

export const { receiveRequest, acceptRequest, declineRequest, setRideStatus } = driverSlice.actions;

export default driverSlice.reducer;
