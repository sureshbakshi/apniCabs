import { createSlice } from '@reduxjs/toolkit';
import { set, isEmpty, cloneDeep } from 'lodash';
import { ClearRideStatus, RideStatus } from '../constants';

// const updateStatusByDriverId = (drivers, driver_id, status) => {
//   forEach(drivers, item => {
//     const driverToUpdate = find(item.drivers, { 'driver_id': driver_id });
//     if (driverToUpdate) {
//       set(driverToUpdate, 'status', status);
//     }
//   });
//   return updatedData;
// };

function updateStatusByDriverId(drivers, driver_id, status) {
  // Find the object in the array using the provided 'id'
  let driverToUpdate = drivers.find(obj => obj.id === driver_id);

  // If the object is found, update its properties
  if (driverToUpdate) {
    set(driverToUpdate, 'status', status); // Update the object with new values
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

const initialState = {
  activeRequestDrivers: null,
  rideRequests: null,
  activeRequestInfo: null,
  driverLocation: null,
  rideStatusUpdate: null,
  requestInfo: null,
  activeRequestId: null,
  recentSearchHistory: { from: [], to: [] },
  otherContactList: [mySelf],
  selectedOtherContact: mySelf,
  activeVehicleTypes: [],
  userLocation: null
}
const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setActiveTabs: (state, action) => {
      const { id, vehicleTypes, status } = action.payload;
      if (id) {
        state.activeRequestId = id
        state.activeRequestInfo = { ...state.activeRequestInfo, status: status || state.activeRequestInfo?.status || RideStatus.INITIATED };
        state.activeVehicleTypes = [...vehicleTypes];
      }
    },
    setActiveRequestDrivers: (state, action) => {
      // on initial request - searchride page
      // on request category change - bike, car etc
      const { id, vehicle_type, drivers, status } = action.payload;
      if (id) {
        const key = vehicle_type;
        state.activeRequestId = id
        state.activeRequestInfo = { ...state.activeRequestInfo, status: status || state.activeRequestInfo?.status || RideStatus.INITIATED };
        state.activeRequestDrivers = { ...(state.activeRequestDrivers || {}), [key]: drivers };
      }
    },
    clearUserRideState: (state, action) => {
      state.rideStatusUpdate = null
    },
    setActiveRequest: (state, action) => {
      // on active request api response
      if (isEmpty(action.payload)) {
        state.activeRequestId = null;
        state.activeRequestInfo = null;
        state.activeVehicleTypes = [];
      } else if (action.payload?.id) {
        state.activeRequestId = action.payload?.id;
        state.activeRequestInfo = action.payload;
        state.activeVehicleTypes = action.payload?.vehicle_types || [];
      }
      state.activeRequestDrivers = null;
    },
    requestInfo: (state, action) => {
      // to store reques from and to location - search ride
      state.requestInfo = action.payload
    },
    cancelRideRequest: (state, action) => {
      // cance all requests
      state.requestInfo = null;
      state.rideRequests = null;
      state.activeRequestInfo = null;
      state.selectedOtherContact = mySelf;
      state.activeRequestId = null;
      state.activeRequestDrivers = null;
    },
    clearUserState: (state, action) => {
      return Object.assign(state, { ...initialState })
    },
    setRecentSearchHistory: (state, action) => {
      const updatedAddress = updateAddress(state.recentSearchHistory, action?.payload)
      state.recentSearchHistory = updatedAddress
    },
    updateActiveRequestDrivers: (state, action) => {
      // update activeRequest drivers - captain card
      const { id: driver_id, status, category } = action.payload;
      const drivers = state.activeRequestDrivers?.[category];
      if (drivers?.length) {
        const existingDrivers = cloneDeep(drivers); // Ensure you're working with a copy
        const updateDrivers = updateStatusByDriverId(existingDrivers, driver_id, status);
        if (updateDrivers?.length) {
          state.activeRequestDrivers[category] = updateDrivers;
        }
      }
    },
    updateDriversRequest: (state, action) => {
      const { status, id, category, driver_id } = action.payload;
      if (status === RideStatus.ACCEPTED || status === RideStatus.ONRIDE) {
        state.activeRequestId = id;
        state.activeRequestInfo = { ...state.activeRequestInfo, status: status };
      } else if (ClearRideStatus.includes(status)) {
        // for cancel  request drivers - captain card
        state.rideStatusUpdate = { ...state.activeRequestInfo, status: status, reason: action.payload?.reason };
        state.activeRequestId = null;
        state.activeRequestInfo = null;
        state.selectedOtherContact = mySelf;
      } else {
        // for active request drivers - captain card
        const activeRequestDrivers = state.activeRequestDrivers;
        if (activeRequestDrivers) {
          const clonedDrivers = cloneDeep(activeRequestDrivers); // Ensure you're working with a copy
          if (clonedDrivers[category]) {
            clonedDrivers[category] = updateStatusByDriverId(clonedDrivers[category], driver_id, status);
          }
          state.activeRequestDrivers = clonedDrivers;
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
  clearUserState,
  updateDriverLocation,
  requestInfo,
  cancelRideRequest,
  setRecentSearchHistory,
  setOtherContactList,
  setSelectedOtherContact,
  clearUserRideState,
  setActiveTabs,
  setUserLocation
} = userSlice.actions;

export default userSlice.reducer;
