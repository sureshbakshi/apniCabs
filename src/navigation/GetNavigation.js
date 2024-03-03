import { useSelector } from 'react-redux';
import { isDriver, isUser } from '../util';
import { isEmpty } from 'lodash';
import UserTabNavigator from './userTabNavigation';
import DriverTabNavigator from './driverTabNavigation';
import LoginNavigator from './loginNavigation';
import useNotifications from '../hooks/useNotifications';

export const GetAuthRoutes = () => {
    const isDriverLogged = isDriver()
    const isUserLogged= isUser()
   if (isDriverLogged) {
        route = <DriverTabNavigator />;
    } else if (isUserLogged) {
      route = <UserTabNavigator />;
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
        route = <GetAuthRoutes/>
    }
    return route
  };