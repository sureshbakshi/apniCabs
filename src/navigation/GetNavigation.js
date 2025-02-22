import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { isDriver, isOwner, isUser, showErrorMessage } from '../util';
import { isEmpty } from 'lodash';
// import UserTabNavigator from './userTabNavigation';
// import DriverTabNavigator from './driverTabNavigation';
import LoginNavigator from './loginNavigation';
import useNotifications from '../hooks/useNotifications';
import useLogout from '../hooks/useLogout';
import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

const DriverTabNavigator = lazy(() => (import('./driverTabNavigation')));
const UserTabNavigator = lazy(() => (import('./userTabNavigation')));


export const GetAuthRoutes = () => {
    const isDriverLogged = isDriver()
    const isUserLogged = isUser()
    const isOwnerLogged= isOwner()
    const { logOut } = useLogout()
    const {t} = useTranslation()
    if (isDriverLogged || isOwnerLogged) {
        route = <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <DriverTabNavigator />
        </Suspense>
    } else if (isUserLogged) {
        route = <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <UserTabNavigator />
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
        route = <GetAuthRoutes />
    }
    return route
};