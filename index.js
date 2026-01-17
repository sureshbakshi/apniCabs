/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/navigation/index';
import { name as appName } from './app.json';
import { store, persistor } from './src/store/index';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/constants';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { foreGroundService } from './src/util/foregroundLocationService';
import { NetworkOverlay } from './src/components/common';
import './i18n';
// import { StrictMode } from 'react';

if (!__DEV__) {
  console.log = () => { };
}
foreGroundService();

function AppWithProvider() {


  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          {/* <StrictMode> */}
          <App />
          <NetworkOverlay />
          {/* </StrictMode> */}
        </SafeAreaProvider>
      </PersistGate>
      <Toast config={toastConfig} />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => AppWithProvider);
