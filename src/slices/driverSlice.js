import { createSlice } from '@reduxjs/toolkit';
import { navigate } from '../util/navigationService';
import { ROUTES_NAMES } from '../constants';

const initialState = {
  rideRequests: [],
  activeRequest: null,
  activeRequestId: null,
  isOnline: false
}

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    declineRequest: (state, action) => {
      const requestObj = action.payload
      state.rideRequests =  state.rideRequests.filter((request) => requestObj.vehicle_id !== request.vehicle_id)
    },
    setActiveRide: (state, action) => {
      const  {active_request_id} = action.payload || {}
      state.activeRequest = action.payload;
      state.activeRequestId = active_request_id;
    },
    cancelRequest: (state, action) => {
      const  {active_request_id} = action.payload || {}
      if(state.activeRequestId === active_request_id) {
        return  Object.assign(state, {...initialState, isOnline: state.isOnline})
      }
    },
    setDriverStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setRideRequest: (state, action) => {
      state.rideRequests = [...state.rideRequests, action.payload];
    },
  },
});

export const { declineRequest, setActiveRide, setDriverStatus, setRideRequest, cancelRequest } = driverSlice.actions;

export default driverSlice.reducer;
