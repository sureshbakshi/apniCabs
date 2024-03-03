import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { apiSlice } from '../slices/apiSlice';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import driverReducer from '../slices/driverSlice';
import persistConfig from './reduxPersistConfig';
import storage from '@react-native-async-storage/async-storage';
import {authInitialState} from '../constants'
const appReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userReducer,
  driver: driverReducer,
});


const rootReducer = (state, action) => {
  if (action.type === 'auth/clearAuthData') {
    storage.removeItem('persist:root')
    state = {
      auth: {
        ...authInitialState,
        device_token: state?.auth?.device_token
      }
    } 
  }
  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  // Add middleware, devTools, etc., as needed
});

const persistor = persistStore(store);
setupListeners(store.dispatch);

export { store, persistor };




