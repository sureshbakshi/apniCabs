/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/navigation/index';
import {name as appName} from './app.json';
import {store} from './src/store/index';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/constants';

function AppWithProvider() {
    return (
      <Provider store={store}>
        <App />
        <Toast config={toastConfig} />
      </Provider>
    );
  }

AppRegistry.registerComponent(appName, () => AppWithProvider);
