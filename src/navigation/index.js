import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../util/navigationService';
import { ActivityIndicator, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { CancelReasonDialog } from '../components/common/cancelReasonDialog';
import GetNavigation from './GetNavigation';
import Bugsnag from '@bugsnag/react-native'
import BugsnagPluginReactNavigation from '@bugsnag/plugin-react-navigation';
import { Text } from '../components/common';

Bugsnag.start({
  plugins: [new BugsnagPluginReactNavigation()],
  onError: function (event) {
    // setBugsnagUserInfo(event)
  }
})
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)
const { createNavigationContainer } = Bugsnag.getPlugin('reactNavigation')
const BugsnagNavigationContainer = createNavigationContainer(NavigationContainer)
const ErrorView = () =>
  <View>
    <Text>Something went wrong. Please try after sometime.</Text>
  </View>
function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorView}>
        <BugsnagNavigationContainer
          ref={navigationRef}
          fallback={<ActivityIndicator color="blue" size="large" />}>
          <GetNavigation />
        </BugsnagNavigationContainer>
        <CancelReasonDialog />
      </ErrorBoundary>
    </>

  );
}

export default App;
