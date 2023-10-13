import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './tabNavigation';
import LoginNavigator from './loginNavigation';
import {navigationRef} from '../util/navigationService';
import {ActivityIndicator} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {useSelector} from 'react-redux';
import _ from 'lodash';

function App() {
  const token = useSelector(state => state.auth.token);

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
