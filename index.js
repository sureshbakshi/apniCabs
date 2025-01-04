/**
 * @format
 */

import { AppRegistry, AppState } from 'react-native';
import App from './src/navigation/index';
import { name as appName } from './app.json';
import { store, persistor } from './src/store/index';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/constants';
import { AuthProvider } from './src/context/Auth.context';
import { PersistGate } from 'redux-persist/integration/react';
import './i18n';

if (!__DEV__) {
  console.log = () => { };
}

function AppWithProvider() {
 

  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          {/* <StrictMode> */}
          <App />
          {/* </StrictMode> */}
        </AuthProvider>
      </PersistGate>
      <Toast config={toastConfig} />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => AppWithProvider);
