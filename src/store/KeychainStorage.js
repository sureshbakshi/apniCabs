import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

const SENSITIVE_KEYS = ['persist:root', 'persist:auth'];
const IS_DEV = __DEV__;

const KeychainStorage = {
    async getItem(key, callback) {
        if (SENSITIVE_KEYS.includes(key) && !IS_DEV) {  // 👈 Skip keychain in dev
            try {
                const credentials = await Keychain.getGenericPassword({ service: key });
                if (credentials?.password) {
                    return callback ? callback(null, credentials.password) : credentials.password;
                }
            } catch { }
        }
        // Always fallback to AsyncStorage
        return AsyncStorage.getItem(key, callback);
    },

    async setItem(key, value, callback) {
        if (SENSITIVE_KEYS.includes(key) && !IS_DEV) {
            try {
                await Keychain.setGenericPassword('user', value, { service: key });
                return callback?.(null);
            } catch { }
        }
        return AsyncStorage.setItem(key, value, callback);
    },

    async removeItem(key, callback) {
        if (SENSITIVE_KEYS.includes(key) && !IS_DEV) {
            try {
                await Keychain.resetGenericPassword({ service: key });
            } catch { }
        }
        return AsyncStorage.removeItem(key, callback);
    },
};

export default KeychainStorage;
