import {createSlice} from '@reduxjs/toolkit';
import { authInitialState} from '../constants';


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
    setDialogStatus:(state, action)=>{
      state.isDialogOpen = action.payload;
    },
    setVehicleTypes:(state, action)=>{
      state.vehicleTypes = action.payload;
    },
    setAndroidDeviceCode: (state, action)=>{
      state.androidDeviceCode = action.payload;
    },
    setSelectedLanguage: (state, action)=>{
      state.selectedLanguage = action.payload;
    },
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
  setSelectedLanguage
} = authSlice.actions;
export default authSlice.reducer;
