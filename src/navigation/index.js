import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './tabNavigation';
import LoginNavigator from './loginNavigation';
import {AuthContext} from '../context/Auth.context';
import { navigationRef } from '../util/navigationService';
import { ActivityIndicator } from 'react-native';

function App() {
  const {state} = useContext(AuthContext);
  return (
      <NavigationContainer ref={navigationRef} fallback={<ActivityIndicator color="blue" size="large" />}>
        {!state.isLoggedIn && <LoginNavigator />}
        {state.isLoggedIn && <TabNavigator />}
      </NavigationContainer>
  );
}

export default App;
