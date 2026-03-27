// ✅ Simplified GetAuthRoutes - No callback prop needed
import { lazy, Suspense, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { showErrorMessage } from '../util';
import isEmpty from 'lodash/isEmpty';
import LoginNavigator from './loginNavigation';
import useNotifications from '../hooks/useNotifications';
import useLogout from '../hooks/useLogout';
import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, USER_ROLES } from '../constants';
import OwnerTabNavigator from './ownerTabNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppInfo } from '../hooks/useAppInfo';
import { mustForceUpdate } from '../hooks/useForceUpdate';
import ForceUpdateModal from '../pages/ForceUpdate';

const DriverTabNavigator = lazy(() => (import('./driverTabNavigation')));
const UserTabNavigator = lazy(() => (import('./userTabNavigation')));
export const GetAuthRoutes = ({ driverInfo, userInfo }) => {
    const route = useMemo(() => {
        const roles = driverInfo?.DriverRoles || userInfo?.roles || [];
        const isDriverLogged = roles.includes(USER_ROLES.DRIVER);
        const isOwnerLogged = roles.includes(USER_ROLES.OWNER);
        const isUserLogged = roles.includes(USER_ROLES.USER);
        if (isDriverLogged) {
            return <DriverTabNavigator />;
        } else if (isUserLogged) {
            return <UserTabNavigator />;
        } else if (isOwnerLogged) {
            return <OwnerTabNavigator />;
        }
        return <LoginNavigator />;
    }, [driverInfo, userInfo]);

    return (
        <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            {route}
        </Suspense>
    );
};

// ✅ Main component stays the same, simpler props
export default () => {
    // All hooks first ✅
    useNotifications();
    const { appInfo } = useAppInfo();
    const access_token = useSelector(state => state.auth.access_token);
    const { driverInfo, userInfo } = useSelector(state => state.auth);
    const { logOut } = useLogout();
    const { t } = useTranslation();

    // Computations ✅
    const { requiredVersion, currentVersion, shouldUpdate } = mustForceUpdate({ appInfo });

    // Handle invalid roles ✅
    useEffect(() => {
        const roles = driverInfo?.DriverRoles || userInfo?.roles || [];
        if (!roles.length && access_token) {
            logOut();
            showErrorMessage(t('login_permission_error'));
        }
    }, [driverInfo, userInfo, access_token, logOut, t]);

    // console.log('requiredVersion', requiredVersion)

    // Force update ✅
    if (shouldUpdate) {
        return (
            <ForceUpdateModal
                visible={true}
                currentVersion={currentVersion}
                newVersion={requiredVersion?.appVersion}
                storeUrl={requiredVersion?.store_url}
            />
        );
    }

    // Final route ✅
    const route = useMemo(() => {
        if (isEmpty(access_token)) {
            return <LoginNavigator />;
        }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top', 'left', 'right']}>
                <GetAuthRoutes driverInfo={driverInfo} userInfo={userInfo} />
            </SafeAreaView>
        );
    }, [access_token, driverInfo, userInfo]);

    return route;
};