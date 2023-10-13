import React, {useContext, useEffect} from 'react';
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

function App() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const [profile, {data: profileData, error: profileError, isLoading}] =
    useProfileMutation();

  useEffect(() => {
    if (token) {
      profile();
    }
  }, [token]);

  useEffect(() => {
    if (profileError) {
      console.log('profileError', profileError);
    } else if (profileData) {
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
      {!token && <LoginNavigator />}
      {token && <TabNavigator />}
    </NavigationContainer>
  );
}

export default App;
