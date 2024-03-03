import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  safelist: [],
  stateReconciler: hardSet,
};

export default persistConfig;
