/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/navigation/index';
import {name as appName} from './app.json';
import { ContextProvider } from './src/context/Auth.context';
function AppWithProvider() {
    return (
      <ContextProvider>
        <App />
      </ContextProvider>
    );
  }

AppRegistry.registerComponent(appName, () => AppWithProvider);
