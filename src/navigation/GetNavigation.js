import { lazy, Suspense, useMemo } from 'react';
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

export const GetAuthRoutes = () => {
    const { driverInfo, userInfo } = useSelector(state => state.auth);
    const { logOut } = useLogout();
    const { t } = useTranslation();

    const route = useMemo(() => {
        const roles = driverInfo?.DriverRoles || userInfo?.roles || [];
        const isDriverLogged = roles.includes(USER_ROLES.DRIVER);
        const isOwnerLogged = roles.includes(USER_ROLES.OWNER);
        const isUserLogged = roles.includes(USER_ROLES.USER);
        if (isDriverLogged) {
            return (
                <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
                    <DriverTabNavigator />
                </Suspense>
            );
        } else if (isUserLogged) {
            return (
                <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
                    <UserTabNavigator />
                </Suspense>
            );
        } else if (isOwnerLogged) {
            return (
                <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
                    <OwnerTabNavigator />
                </Suspense>
            );
        } else {
            logOut();
            showErrorMessage(t('login_permission_error'));
            return <LoginNavigator />;
        }
    }, [driverInfo, userInfo, logOut, t]);

    return route;
};

export default () => {
    useNotifications();

    const { appInfo } = useAppInfo();

    const access_token = useSelector(state => state.auth.access_token);
    const { requiredVersion, currentVersion, shouldUpdate } = mustForceUpdate({ appInfo });


    if (shouldUpdate) {
        return (
            <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
                <ForceUpdateModal
                    visible={!shouldUpdate}
                    currentVersion={currentVersion}
                    newVersion={requiredVersion?.appVersion}
                    storeUrl={requiredVersion?.store_url}
                />
            </Suspense>
        );
    }

    const route = useMemo(() => {
        if (isEmpty(access_token)) {
            return <LoginNavigator />;
        } else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top', 'left', 'right']}>
                    <GetAuthRoutes />
                </SafeAreaView>
            );
        }
    }, [access_token]);

    return route;
};