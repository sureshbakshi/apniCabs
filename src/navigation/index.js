import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './tabNavigation';
import LoginNavigator from './loginNavigation';
import {navigationRef} from '../util/navigationService';
import {ActivityIndicator} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {useSelector, useDispatch} from 'react-redux';
import {useProfileMutation} from '../slices/apiSlice';
import {updateProfileInfo} from '../slices/authSlice';
import _ from 'lodash';
import {useAuthContext} from '../context/Auth.context';
function App() {
  const {isLoggedIn, getToken} = useAuthContext();
  console.log('isLoggedIn', isLoggedIn);
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
      {isLoggedIn && <TabNavigator />}
    </NavigationContainer>
  );
}

export default App;
