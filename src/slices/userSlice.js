import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { ClearRideStatus, RideStatus } from '../constants';

// const updateStatusByDriverId = (drivers, driver_id, status) => {
//   _.forEach(drivers, item => {
//     const driverToUpdate = _.find(item.drivers, { 'driver_id': driver_id });
//     if (driverToUpdate) {
//       _.set(driverToUpdate, 'status', status);
//     }
//   });
//   return updatedData;
// };

function updateStatusByDriverId(drivers, driver_id, status) {
  // Find the object in the array using the provided 'id'
  let driverToUpdate = drivers.find(obj => obj.id === driver_id);

  // If the object is found, update its properties
  if (driverToUpdate) {
      _.set(driverToUpdate, 'status', status); // Update the object with new values
  }

  // Return the updated array (the array is mutated)
  return drivers;
}

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
  activeRequestDrivers: null,
  rideRequests: null,
  activeRequest: null,
  activeRequestInfo: null,
  driverLocation: null,
  statusUpdate: null,
  requestInfo: null,
  activeRequestId: null,
  recentSearchHistory: { from: [], to: [] },
  otherContactList: [mySelf],
  selectedOtherContact: mySelf
}
const userSlice = createSlice({
  name: 'user',
  initialState: intialState,
  reducers: {
    setActiveRequestDrivers: (state, action) => {
      const { id, category, code, drivers } = action.payload;
      if (id) {
        const key = category || code;
        state.activeRequestId = id
        state.activeRequestDrivers = { ...state.activeRequestDrivers, [key]: drivers };
      }
    },
    setActiveRequest: (state, action) => {
      const { id, ...rest } = action.payload;
      if (id) {
        state.activeRequestId = id;
        state.activeRequestInfo = rest;
      }
    },
    requestInfo: (state, action) => {
      state.requestInfo = action.payload
    },
    cancelRideRequest: (state, action) => {
      state.requestInfo = null;
      state.rideRequests = null;
      state.activeRequest = null;
      state.selectedOtherContact = null;
      state.activeRequestId = null;
      state.activeRequestDrivers = null;
    },
    setActiveRideRequest: (state, action) => {
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
    updateActiveRequestDrivers: (state, action) => {
      const { id: driver_id, status, category } = action.payload;
        const drivers = state.activeRequestDrivers?.[category];
        if (drivers?.length) {
          const existingDrivers = _.cloneDeep(drivers); // Ensure you're working with a copy
          const updateDrivers = updateStatusByDriverId(existingDrivers, driver_id, status);
          if (updateDrivers?.length) {
            state.activeRequestDrivers[category] = updateDrivers;
          }
      }
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
  setActiveRequestDrivers,
  updateDriversRequest,
  updateActiveRequestDrivers,
  setActiveRequest,
  setActiveRideRequest,
  clearUserState,
  updateDriverLocation,
  requestInfo,
  cancelRideRequest,
  setRecentSearchHistory,
  setOtherContactList,
  setSelectedOtherContact
} = userSlice.actions;

export default userSlice.reducer;
