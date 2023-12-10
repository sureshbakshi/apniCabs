import {createSlice} from '@reduxjs/toolkit';
import {USER_ROLES} from '../constants';

const initialState = {
  googleInfo: null,
  userInfo: null,
  access_token: null,
  driverInfo: null,
  isSocketConnected: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
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
    updateLoginToken(state, action) {
      if (action.payload?.token) {
        state.access_token = action.payload.token;
      }
    },
    updateUserInfo(state, action) {
      const {roles, token, id} = action.payload;
      if (token) {
        state.userInfo = action.payload;
        state.access_token = token;
        if (roles.includes(USER_ROLES.DRIVER)) {
          // getProfileDetails(id);
        }
      }
    },
    clearAuthData(state, action) {
      state.access_token = null;
    },
    setDriverDetails(state, action) {
      state.driverInfo = action.payload;
    },
    updatedSocketConnectionStatus: (state, action) => {
      state.isSocketConnected = action.payload;
    },
  },
});
export const {
  updateGoogleUserInfo,
  updateUserCheck,
  updateUserInfo,
  updateLoginToken,
  clearAuthData,
  setDriverDetails,
  updatedSocketConnectionStatus
} = authSlice.actions;
export default authSlice.reducer;
