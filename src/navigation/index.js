import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './tabNavigation';
import LoginNavigator from './loginNavigation';
import { navigationRef } from '../util/navigationService';
import { ActivityIndicator } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import {useSelector} from 'react-redux'
import _ from 'lodash';

function App() {
  const userData = useSelector((state)=>state.auth.user);
  console.log(userData)

  useEffect(() =>{
    SplashScreen.hide();
  })
  return (
      <NavigationContainer ref={navigationRef} fallback={<ActivityIndicator color="blue" size="large" />}>
      {_.isEmpty(userData) && <LoginNavigator />}
      {!_.isEmpty(userData) && <TabNavigator />}
      </NavigationContainer>
  );
}

export default App;
