import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './tabNavigation';
import LoginNavigator from './loginNavigation';
import {AuthContext} from '../context/Auth.context';
function App() {
  const {state} = useContext(AuthContext);
  return (
      <NavigationContainer>
        {!state.isLoggedIn && <LoginNavigator />}
        {state.isLoggedIn && <TabNavigator />}
      </NavigationContainer>
  );
}

export default App;
