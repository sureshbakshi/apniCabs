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

function updateAddress(existingAddress, newAddress) {
  // Check if place_id exists in the existing 'from' array
  const fromPlaceIds = existingAddress?.from?.map(item => item.place_id);
  const toPlaceIds = existingAddress?.to?.map(item => item.place_id);

  // Check if the place_id from new 'from' and 'to' exists
  if (!fromPlaceIds.includes(newAddress.from.place_id)) {
    existingAddress.from.push(newAddress.from);  // Push to 'from' if not found
  }

  if (!toPlaceIds.includes(newAddress.to.place_id)) {
    existingAddress.to.push(newAddress.to);  // Push to 'to' if not found
  }

  return existingAddress;
}

const updatedOtherContact = (existingContactList, newContact) => {
  const exists = existingContactList.some(existingContact => existingContact.number === newContact.number);

  if (!exists) {
    existingContactList.push(newContact);
  }
  return existingContactList;
};

const mySelf = {
  name: 'Myself',
  number: 0
}

const intialState = {
  activeRideId: null,
  rideRequests: null,
  activeRequest: null,
  driverLocation: null,
  statusUpdate: null,
  requestInfo: null,
  recentSearchHistory: { from: [], to: [] },
  otherContactList: [mySelf],
  selectedOtherContact: mySelf
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
      state.selectedOtherContact = null;
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
      return Object.assign(state, { ...intialState })
    },
    setRecentSearchHistory: (state, action) => {
      const updatedAddress = updateAddress(state.recentSearchHistory, action?.payload)
      state.recentSearchHistory = updatedAddress
    },
    updateDriversRequest: (state, action) => {
      const { driver_id, status, id } = action.payload;
      if (status === RideStatus.ACCEPTED || status === RideStatus.ONRIDE) {
        state.activeRequest = action.payload
        state.rideRequests = [];
        state.selectedOtherContact = null;
        state.activeRideId = status === RideStatus.ONRIDE ? id : state.activeRideId

      } else if (ClearRideStatus.includes(status)) {
        state.statusUpdate = action.payload;
        state.selectedOtherContact = null;
      } else {
        const vehicles = state.rideRequests?.vehicles;
        if (vehicles?.length) {
          const updatedData = _.cloneDeep(vehicles); // Ensure you're working with a copy
          const updateDrivers = updateStatusByDriverId(updatedData, driver_id, status);
          if (updateDrivers?.length) {
            state.rideRequests.vehicles = updateDrivers;
          }
        }
      }
    },
    updateDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
    setOtherContactList: (state, action) => {
      const updatedContactList = updatedOtherContact(state.otherContactList, action.payload)
      state.otherContactList = updatedContactList;
    },
    setSelectedOtherContact: (state, action) => {
      state.selectedOtherContact = action.payload;
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
  cancelRideRequest,
  setRecentSearchHistory,
  setOtherContactList,
  setSelectedOtherContact
} = userSlice.actions;

export default userSlice.reducer;
