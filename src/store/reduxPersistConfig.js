import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import KeychainStorage from './KeychainStorage';
const persistConfig = {
  key: 'root',
  storage: KeychainStorage,  // Hybrid: auth=keychain, rest=async
  blacklist: ['api'],  // RTK Query never persists
  stateReconciler: hardSet,
};

export default persistConfig;
