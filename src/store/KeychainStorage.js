import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const AUTH_KEYS = ['persist:auth'];  // 👈 Only auth slice
const IS_DEV = __DEV__;

const KeychainStorage = {
    async getItem(key, callback) {
        if (AUTH_KEYS.includes(key) && !IS_DEV) {
            try {
                const credentials = await Keychain.getGenericPassword({ service: key });
                if (credentials?.password) {
                    return callback ? callback(null, credentials.password) : credentials.password;
                }
            } catch { }
        }
        // All other slices → AsyncStorage
        return AsyncStorage.getItem(key, callback);
    },

    async setItem(key, value, callback) {
        if (AUTH_KEYS.includes(key) && !IS_DEV) {
            try {
                await Keychain.setGenericPassword('user', value, { service: key });
                return callback?.(null);
            } catch { }
            return;
        }
        // user/driver/api → AsyncStorage
        return AsyncStorage.setItem(key, value, callback);
    },

    async removeItem(key, callback) {
        if (AUTH_KEYS.includes(key) && !IS_DEV) {
            try {
                await Keychain.resetGenericPassword({ service: key });
            } catch { }
        }
        return AsyncStorage.removeItem(key, callback);
    },
};

export default KeychainStorage;
