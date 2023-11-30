import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user_check: {
    user: false,
  },
  googleInfo: null,
  userInfo: null,
  access_token: null,
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
      }
      state.user_check = action.payload;
    },
    updateLoginToken(state, action) {
      if (action.payload?.token) {
        state.access_token = action.payload.token;
      }
    },
    updateUserInfo(state, action) {
      if (action.payload?.data) {
        state.userInfo = action.payload.data;
      }
    },
    updateProfileInfo(state, action) {
      state.profileInfo = action.payload;
      if (action.payload.token) {
        state.access_token = action.payload.token;
      }
    },
    clearAuthData(state, action) {
      state.access_token = null;
    },
  },
});
export const {
  updateGoogleUserInfo,
  updateUserCheck,
  updateUserInfo,
  updateLoginToken,
  clearAuthData,
  updateProfileInfo,
} = authSlice.actions;
export default authSlice.reducer;
