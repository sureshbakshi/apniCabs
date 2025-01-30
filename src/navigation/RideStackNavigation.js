import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS, ROUTES_NAMES } from '../constants';
import UserRideHistory from '../pages/user/UserRideHistory';
import RideDetails from '../pages/RideDetails';
import { isDriver } from '../util';
import DriverRideHistory from '../pages/driver/DriverRideHistory';
import { Icon } from '../components/common';
import CustomButton from '../components/common/CustomButton';
import CommonStyles from '../styles/commonStyles';
import { goBack } from '../util/navigationService';
import HeaderBackButton from '../components/common/HeaderBackButton';
import ChatUI from '../components/common/chat';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useEffect } from 'react';
const Stack = createNativeStackNavigator();

export default function RideStackNavigation({ navigation, route }) {
    const isDriverLogged = isDriver();

    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: COLORS.black,
                headerTitleStyle: {
                    ...CommonStyles.headerFont
                },
                headerTitleAlign: 'center',
            }}>
            <Stack.Screen name={ROUTES_NAMES.myRides} options={{ title: 'My Rides', headerShown: false }} component={isDriverLogged ? DriverRideHistory : UserRideHistory} />
            <Stack.Screen
                name={ROUTES_NAMES.rideDetails}
                options={{
                    title: 'Ride Details',
                    headerLeft: () => <HeaderBackButton />,
                    headerShadowVisible: false
                }}
                component={RideDetails}
            />
            <Stack.Screen
                name={ROUTES_NAMES.chat}
                options={{
                    title: 'Chat',
                    headerLeft: () => <HeaderBackButton />,
                    headerShown: true
                }}
                component={ChatUI}
            />
        </Stack.Navigator>
    );
}
