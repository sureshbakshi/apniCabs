import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import UserTabNavigator from './userTabNavigation';
import DriverTabNavigator from './driverTabNavigation';
import LoginNavigator from './loginNavigation';
import {navigationRef} from '../util/navigationService';
import {ActivityIndicator} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useSelector} from 'react-redux';
import {isDriver, isUser} from '../util';
import {isEmpty} from 'lodash';
function App() {
  const {access_token} = useSelector(state => state.auth);
  useEffect(() => {
    SplashScreen.hide();
  });
  const GetNavigation = () => {
    if (isEmpty(access_token)) {
      return <LoginNavigator />;
    } else if (isDriver()) {
      return <DriverTabNavigator />;
    } else if (isUser()) {
      return <UserTabNavigator />;
    } 
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      fallback={<ActivityIndicator color="blue" size="large" />}>
      <GetNavigation />
    </NavigationContainer>
  );
}

export default App;
