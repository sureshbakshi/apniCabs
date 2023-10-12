import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user_check: {
    user: false,
  },
  googleInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateGoogleUserInfo(state, action) {
      state.googleInfo = action.payload;
    },
    updateUserCheck(state, action) {
      state.user_check = action.payload;
    },
  },
});
export const {updateGoogleUserInfo, updateUserCheck} = authSlice.actions;
export default authSlice.reducer;
