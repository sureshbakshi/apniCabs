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
import CommonStyles from '../styles/commonStyles';
import { ROUTES_NAMES } from '../constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessageInfo from '../components/common/MessageInfo';

const DriverTabNavigator = lazy(() => (import('./driverTabNavigation')));
const UserTabNavigator = lazy(() => (import('./userTabNavigation')));


export const GetAuthRoutes = () => {
    const isDriverLogged = isDriver()
    const isUserLogged = isUser()
    const isOwnerLogged = isOwner()
    const { logOut } = useLogout()
    const { t } = useTranslation()
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
    useNotifications()

    let route = null
    if (isEmpty(access_token)) {
        route = <LoginNavigator />;
    } else {
        route = <GetAuthRoutes />
    }
    return route
};