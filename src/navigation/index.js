import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef } from '../util/navigationService';
import { ActivityIndicator } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { CancelReasonDialog } from '../components/common/cancelReasonDialog';
import GetNavigation from './GetNavigation';
function App() {
  useEffect(() => {
    SplashScreen.hide();
  },[]);

  return (
    <>

      <NavigationContainer
        ref={navigationRef}
        fallback={<ActivityIndicator color="blue" size="large" />}>
        <GetNavigation />
      </NavigationContainer>

      <CancelReasonDialog/>
    </>

  );
}

export default App;
