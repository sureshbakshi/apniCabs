import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from '../slices/apiSlice';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import authReducer from '../slices/authSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

