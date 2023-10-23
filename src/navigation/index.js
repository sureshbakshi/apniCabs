import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import UserTabNavigator from './userTabNavigation';
import DriverTabNavigator from './driverTabNavigation';
import LoginNavigator from './loginNavigation';
import {navigationRef} from '../util/navigationService';
import {ActivityIndicator} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch} from 'react-redux';
import {useProfileMutation} from '../slices/apiSlice';
import {updateProfileInfo} from '../slices/authSlice';
import _ from 'lodash';
import {useAuthContext} from '../context/Auth.context';
import { isUserOrDriver } from '../util';

function App() {
  const {isLoggedIn, getToken} = useAuthContext();
  const dispatch = useDispatch();
  const [profile, {data: profileData, error: profileError, isLoading}] =
    useProfileMutation();
  useEffect(() => {
    if (isLoggedIn) {
      profile();
    } else {
      getToken();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (profileError) {
      console.log('profileError', profileError);
    } else if (profileData) {
      console.log('profileData', profileData);
      dispatch(updateProfileInfo(profileData));
    }
  }, [profileData, profileError]);
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <NavigationContainer
      ref={navigationRef}
      fallback={<ActivityIndicator color="blue" size="large" />}>
      {!isLoggedIn && <LoginNavigator />}
      {isLoggedIn && isUserOrDriver() && <UserTabNavigator />}
      {isLoggedIn && !isUserOrDriver() && <DriverTabNavigator />}
    </NavigationContainer>
  );
}

export default App;
