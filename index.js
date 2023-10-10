/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/navigation/index';
import {name as appName} from './app.json';
import {store} from './src/store/index';
import {Provider} from 'react-redux';

function AppWithProvider() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }

AppRegistry.registerComponent(appName, () => AppWithProvider);
