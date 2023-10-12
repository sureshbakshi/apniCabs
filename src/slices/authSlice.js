import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  email:'',
  password:''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserData(state, action) {
      state.user = action.payload
    },
  },
});
export const {updateUserData} = authSlice.actions;
export default authSlice.reducer;
