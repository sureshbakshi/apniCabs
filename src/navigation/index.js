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
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import SomethingWentWrong from '../components/common/Error';

Bugsnag.start({
  plugins: [new BugsnagPluginReactNavigation()],
  onError: function (event) {
    // setBugsnagUserInfo(event)
  }
})
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)
const { createNavigationContainer } = Bugsnag.getPlugin('reactNavigation')
const BugsnagNavigationContainer = createNavigationContainer(NavigationContainer)
const ErrorView = () => <SomethingWentWrong />
function App() {
    const { i18n } = useTranslation();
    const {selectedLanguage} = useSelector(state => state.auth);

  useEffect(() => {
    SplashScreen.hide();
    i18n.changeLanguage(selectedLanguage);
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
