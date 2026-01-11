import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import KeychainStorage from './KeychainStorage';
const persistConfig = {
  key: 'root',
  storage: KeychainStorage,
  safelist: [],
  stateReconciler: hardSet,
};

export default persistConfig;
