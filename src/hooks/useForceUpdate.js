import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { USER_ROLES } from '../constants';
import { compareVersion } from '../util';
import config from '../util/config';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yourcompany.yourapp';
const IOS_STORE_URL = 'https://apps.apple.com/app/id1234567890';

const getCurrentVersion = () => {
    const raw = DeviceInfo.getReadableVersion(); // e.g. "1.2.5 (45)"
    return raw.split(' ')[0].split('-')[0]; // "1.2.5"
};

const getRequiredVersion = (appInfo) => {
    const role = config.ROLE;
    const store_android_driver_url = config.STORE_ANDROID_DRIVER_URL
    const store_android_user_url = config.STORE_ANDROID_USER_URL
    const store_ios_driver_url = config.STORE_IOS_DRIVER_URL
    const store_ios_user_url = config.STORE_IOS_USER_URL


    if (role === USER_ROLES.DRIVER) {
        return {
            appVersion: Platform.OS === 'ios' ? appInfo.ios_driver : appInfo.driver_android,
            store_url: Platform.OS === 'ios' ? store_ios_driver_url : store_android_user_url,
        };
    }

    if (role === USER_ROLES.USER) {
        return {
            appVersion: Platform.OS === 'ios' ? appInfo.user_ios : appInfo.user_android,
            store_url: Platform.OS === 'ios' ? store_ios_user_url : store_android_driver_url,
        };
    }
    return null;
};

export const mustForceUpdate = ({ appInfo }) => {
    const currentVersion = getCurrentVersion();

    if (!appInfo) {
        return { requiredVersion: null, currentVersion, shouldUpdate: false };
    }

    const requiredVersion = getRequiredVersion(appInfo);

    if (!requiredVersion || !requiredVersion.appVersion) {
        return { requiredVersion: null, currentVersion, shouldUpdate: false };
    }

    const shouldUpdate =
        compareVersion(currentVersion, requiredVersion?.appVersion) < 0;

    return { requiredVersion, currentVersion, shouldUpdate };
};
