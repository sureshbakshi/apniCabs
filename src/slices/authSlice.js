import {createSlice} from '@reduxjs/toolkit';
import {USER_ROLES} from '../constants';
import {useGetDriverDetailsQuery} from './apiSlice';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';

const initialState = {
  user_check: {
    user: false,
  },
  googleInfo: null,
  userInfo: null,
  access_token: null,
  driverInfo: null,
};

// const getProfileDetails = id => {
//   // const dispatch = useDispatch();
//   const {data, error, isLoading} = useGetDriverDetailsQuery(id);
//   console.log(data, error);
//   dispatch(setDriverDetails(data));

//   // useEffect(() => {
//   //   if (data) {
//   //     console.log(data);
//   //   } else if (error) {
//   //     console.log(error);
//   //   }
//   // }, [data, error]);
// };

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
  },
});
export const {
  updateGoogleUserInfo,
  updateUserCheck,
  updateUserInfo,
  updateLoginToken,
  clearAuthData,
  setDriverDetails,
} = authSlice.actions;
export default authSlice.reducer;
