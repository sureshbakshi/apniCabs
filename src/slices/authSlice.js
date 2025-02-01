import { createSlice } from '@reduxjs/toolkit';
import { authInitialState } from '../constants';


const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    updateGoogleUserInfo(state, action) {
      state.googleInfo = action.payload;
    },
    updateUserCheck(state, action) {
      if (action.payload?.token) {
        state.access_token = action.payload.token;
        state.userInfo = action.payload
      }
    },
    clearAuthData(state, action) {
      state.access_token = null;
    },
    setDriverDetails(state, action) {
      state.driverInfo = action.payload;
    },
    setDeviceToken(state, action) {
      state.device_token = action.payload
    },
    updatedSocketConnectionStatus: (state, action) => {
      state.isSocketConnected = action.payload;
    },
    setDialogStatus: (state, action) => {
      state.isDialogOpen = action.payload;
    },
    setVehicleTypes: (state, action) => {
      state.vehicleTypes = action.payload;
    },
    setAndroidDeviceCode: (state, action) => {
      state.androidDeviceCode = action.payload;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setRideChats: (state, action) => {
      const { message, ride_id } = action.payload;
      const copyMessage = { ...message };
      if (state.rideChats?.ride_id === ride_id) {
        state.rideChats.messages = [...state.rideChats.messages, copyMessage]
      } else {
        state.rideChats = { messages: [copyMessage], ride_id };
      }
    },
    clearRideChats: (state, action) => {
      state.rideChats = authInitialState.rideChats
    }
  },
});
export const {
  updateGoogleUserInfo,
  updateUserCheck,
  clearAuthData,
  setDriverDetails,
  updatedSocketConnectionStatus,
  setDialogStatus,
  setDeviceToken,
  setVehicleTypes,
  setAndroidDeviceCode,
  setSelectedLanguage,
  setRideChats,
  clearRideChats
} = authSlice.actions;
export default authSlice.reducer;
