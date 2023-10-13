import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user_check: {
    user: false,
  },
  googleInfo: null,
  userInfo: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateGoogleUserInfo(state, action) {
      state.googleInfo = action.payload;
    },
    updateUserCheck(state, action) {
      if(action.payload?.token) {
        state.token = action.payload.token 
      }
      state.user_check = action.payload;
    },
    updateLoginToken(state, action) {
      if(action.payload?.token) {
        state.token = action.payload.token 
      }
    },
    updateUserInfo(state, action) {
      if(action.payload?.data) {
        state.userInfo = action.payload.data
      }
    },
    updateProfileInfo(state, action) {
        state.profileInfo = action.payload.data
    },
    clearAuthData(state, action) {
      state.token = null
    }
  },
});
export const {updateGoogleUserInfo, updateUserCheck, updateUserInfo, updateLoginToken, clearAuthData,updateProfileInfo} = authSlice.actions;
export default authSlice.reducer;
