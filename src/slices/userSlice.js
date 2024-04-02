import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { ClearRideStatus, RideStatus } from '../constants';

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
  driverLocation: null,
  statusUpdate: null,
  requestInfo: null,

}
const userSlice = createSlice({
  name: 'user',
  initialState: intialState,
  reducers: {
    setRideRequest: (state, action) => {
      state.rideRequests = action.payload;
    },
    requestInfo: (state, action) => {
      state.requestInfo = action.payload
    },
    cancelRideRequest: (state, action) => {
      state.requestInfo = null;
      state.rideRequests = null;
      state.activeRequest = null;
    },
    setActiveRequest: (state, action) => {
      if (_.isEmpty(action.payload)) {
        state.activeRequest = null;
        state.activeRideId = null
        state.statusUpdate = null;
      } else {
        const { status, id } = action.payload
        state.activeRequest = action.payload;
        state.activeRideId = status === RideStatus.ONRIDE ? id : state.activeRideId
      }
    },
    clearUserState: (state, action) => {
      return intialState
    },

    updateDriversRequest: (state, action) => {
      const { driver_id, status, id } = action.payload;
      if (status === RideStatus.ACCEPTED || status === RideStatus.ONRIDE) {
        state.activeRequest = action.payload
        state.rideRequests = []
        state.activeRideId = status === RideStatus.ONRIDE ? id : state.activeRideId

      } else if (ClearRideStatus.includes(status)) {
        state.statusUpdate = action.payload;
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
    updateDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
  },
});

export const {
  setRideRequest,
  updateDriversRequest,
  setActiveRequest,
  clearUserState,
  updateDriverLocation,
  requestInfo,
  cancelRideRequest
} = userSlice.actions;

export default userSlice.reducer;
