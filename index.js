/**
 * @format
 */

import { AppRegistry, AppState, StatusBar } from 'react-native';
// Ensure secure random and crypto are available before anything else
import 'react-native-get-random-values';
import './src/shims/crypto';
import App from './src/navigation/index';
import { name as appName } from './app.json';
import { store, persistor } from './src/store/index';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { COLORS, toastConfig } from './src/constants';
import { AuthProvider } from './src/context/Auth.context';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import './i18n';

if (!__DEV__) {
  console.log = () => { };
}

function AppWithProvider() {


  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <SafeAreaProvider>
            {/* <StrictMode> */}
            <App />
            {/* </StrictMode> */}
          </SafeAreaProvider>
        </AuthProvider>
      </PersistGate>
      <Toast config={toastConfig} />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => AppWithProvider);
