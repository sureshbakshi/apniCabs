import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    // Define user state here
    userRequests: [],
    activeRide: null,
  },
  reducers: {
    sendRequest: (state, action) => {
      // Handle sending a request and update userRequests
    },
    cancelRequest: (state) => {
      // Handle canceling a request and update userRequests
    },
    acceptRequest: (state, action) => {
      // Handle accepting a request and update activeRide
      state.activeRide = action.payload;
    },
    // Add other actions and reducers
  },
});

export const { sendRequest, cancelRequest, acceptRequest } = userSlice.actions;

export default userSlice.reducer;
