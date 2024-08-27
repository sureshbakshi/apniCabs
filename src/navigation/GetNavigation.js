import { useSelector } from 'react-redux';
import { isDriver, isUser, showErrorMessage } from '../util';
import { isEmpty } from 'lodash';
import UserTabNavigator from './userTabNavigation';
import DriverTabNavigator from './driverTabNavigation';
import LoginNavigator from './loginNavigation';
import useNotifications from '../hooks/useNotifications';
import useLogout from '../hooks/useLogout';

export const GetAuthRoutes = () => {
    const isDriverLogged = isDriver()
    const isUserLogged = isUser()
    const { logOut } = useLogout()

    if (isDriverLogged) {
        route = <DriverTabNavigator />;
    } else if (isUserLogged) {
        route = <UserTabNavigator />;
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