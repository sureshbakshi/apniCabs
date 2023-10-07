import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './tabNavigation';
import LoginNavigator from './loginNavigation';
import {AuthContext} from '../context/Auth.context';
import { navigationRef } from '../util/navigationService';
import { ActivityIndicator } from 'react-native';
import SplashScreen from 'react-native-splash-screen'


function App() {
  const {state} = useContext(AuthContext);
  useEffect(() =>{
    SplashScreen.hide();
  })
  return (
      <NavigationContainer ref={navigationRef} fallback={<ActivityIndicator color="blue" size="large" />}>
        {!state.isLoggedIn && <LoginNavigator />}
        {state.isLoggedIn && <TabNavigator />}
      </NavigationContainer>
  );
}

export default App;
