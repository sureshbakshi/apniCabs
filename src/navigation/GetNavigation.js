import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { isDriver, isUser, showErrorMessage } from '../util';
import { isEmpty } from 'lodash';
// import UserTabNavigator from './userTabNavigation';
// import DriverTabNavigator from './driverTabNavigation';
import LoginNavigator from './loginNavigation';
import useNotifications from '../hooks/useNotifications';
import useLogout from '../hooks/useLogout';
import { ActivityIndicator } from 'react-native';

const DriverTabNavigator = lazy(() => (import('./driverTabNavigation')));
const UserTabNavigator = lazy(() => (import('./userTabNavigation')));


export const GetAuthRoutes = () => {
    const isDriverLogged = isDriver()
    const isUserLogged = isUser()
    const { logOut } = useLogout()
    if (isDriverLogged) {
        route = <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <DriverTabNavigator />
        </Suspense>
    } else if (isUserLogged) {
        route = <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <UserTabNavigator />
        </Suspense>
    } else {
        logOut()
        showErrorMessage(`You don't have enough permission to login.`)
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