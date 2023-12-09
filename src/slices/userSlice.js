import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RideStatus } from '../constants';
import { activeReq } from '../mock/activeRequest';


const updateStatusByDriverId = (updatedData, driver_id, status) => {
  _.forEach(updatedData, item => {
    const driverToUpdate = _.find(item.drivers, { 'driver_id': driver_id });
    if (driverToUpdate) {
      _.set(driverToUpdate, 'status', status);
    }
  });
  return updatedData;
};
const intialState = {
  activeRideId: null,
  rideRequests: null,
  activeRequest: null,
  isSocketConnected:false
}
const userSlice = createSlice({
  name: 'user',
  initialState: intialState,
  reducers: {

    setRideRequest: (state, action) => {
      state.rideRequests = action.payload;
    },
    setActiveRequest: (state, action) => {
      state.activeRequest = action.payload;
    },
    cancelActiveRequest: (state, action) => {
      return Object.assign(state, { ...initialState })
    },
    updatedSocketConnectionStatus: (state, action) => {
      state.isSocketConnected = action.payload;
    },
    updateDriversRequest: (state, action) => {
      const { driver_id, status } = action.payload;

      if (status === RideStatus.ACCEPTED) {
        state.activeRequest = action.payload
        state.rideRequests = []
      } else if (status === RideStatus.USER_CANCELLED || status === RideStatus.DRIVER_CANCELLED || status === RideStatus.COMPLETED) {
        return Object.assign(state, { ...initialState })
      } else {
        const vehicles = state.rideRequests?.vehicles;
        if (vehicles.length) {
          const updatedData = _.cloneDeep(vehicles); // Ensure you're working with a copy
          const updateDrivers = updateStatusByDriverId(updatedData, driver_id, status);
          if (updateDrivers.length) {
            state.rideRequests.vehicles = updateDrivers;
          }
        }
      }
    },
  },
});

export const {
  setRideRequest,
  updateDriversRequest,
  setActiveRequest,
  cancelActiveRequest,
  updatedSocketConnectionStatus
} = userSlice.actions;

export default userSlice.reducer;
