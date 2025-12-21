import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { isUser, showErrorMessage } from '../util';
import { isEmpty } from 'lodash';
// import UserTabNavigator from './userTabNavigation';
// import DriverTabNavigator from './driverTabNavigation';
import LoginNavigator from './loginNavigation';
import useNotifications from '../hooks/useNotifications';
import useLogout from '../hooks/useLogout';
import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, USER_ROLES } from '../constants';
import OwnerTabNavigator from './ownerTabNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

const DriverTabNavigator = lazy(() => (import('./driverTabNavigation')));
const UserTabNavigator = lazy(() => (import('./userTabNavigation')));


export const GetAuthRoutes = () => {
    const { driverInfo, userInfo } = useSelector(state => state.auth);
    const isUserLogged = isUser()
    const { logOut } = useLogout()
    const { t } = useTranslation()
    const roles = driverInfo?.DriverRoles || userInfo?.roles || [];
    const isDriverLogged = roles.includes(USER_ROLES.DRIVER);
    const isOwnerLogged = roles.includes(USER_ROLES.OWNER);
    if (isDriverLogged) {
        route = <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <DriverTabNavigator />
        </Suspense>
    } else if (isUserLogged) {
        route = <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <UserTabNavigator />
        </Suspense>
    } else if (isOwnerLogged) {
        route = <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <OwnerTabNavigator />
        </Suspense>
    } else {
        logOut()
        showErrorMessage(t('login_permission_error'))
        route = <LoginNavigator />;
    }
    return route
}
export default () => {
    const { access_token } = useSelector(state => state.auth);
    useNotifications()

    let route = null
    if (isEmpty(access_token)) {
        route = <LoginNavigator />;
    } else {
        route = <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top', 'left', 'right']}>
            <GetAuthRoutes />
         </SafeAreaView>
    }
    return route
};