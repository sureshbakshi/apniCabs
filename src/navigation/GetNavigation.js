import { lazy, Suspense, useEffect, useState } from 'react';
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
import CommonStyles from '../styles/commonStyles';
import { ROUTES_NAMES, USER_ROLES } from '../constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessageInfo from '../components/common/MessageInfo';
import ServiceUnavailableScreen from '../pages/ServiceUnavailableScreen';

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
        const Stack = createNativeStackNavigator();
        route = <Stack.Navigator
            screenOptions={{
                headerTransparent: true,
                headerTintColor: '#fff',
                headerStyle: {
                    marginBottom: 50,
                },
                headerTitleStyle: {
                    ...CommonStyles.headerFont
                },
                headerShown: false,
                animation: 'slide_from_right'
            }}>
            <Stack.Screen
                name={ROUTES_NAMES.messageInfo}
                options={{ title: t('notification') }}
                component={MessageInfo}
            />
        </Stack.Navigator>
    } else {
        logOut()
        showErrorMessage(t('login_permission_error'))
        route = <LoginNavigator />;
    }
    return route
}
export default () => {
    const { access_token } = useSelector(state => state.auth);
    const [isServiceAvailable, setIsServiceAvailable] = useState(true);

    useNotifications();
    // useEffect(() => {
    //     const checkService = async () => {
    //         try {
    //             const response = await fetch('/api/health', {
    //                 headers: { Authorization: `Bearer ${access_token}` }
    //             });
    //             setIsServiceAvailable(response.ok);
    //         } catch {
    //             setIsServiceAvailable(false);
    //         }
    //     };
    //     if (access_token) {
    //         checkService();
    //         const interval = setInterval(checkService, 30000); // Check every 30s
    //         return () => clearInterval(interval);
    //     }
    // }, [access_token]);


    let route = null
    if (isEmpty(access_token)) {
        route = <LoginNavigator />;
    } else if (!isServiceAvailable) {
        route = <ServiceUnavailableScreen />;
    } else {
        route = <GetAuthRoutes />
    }
    return route
};