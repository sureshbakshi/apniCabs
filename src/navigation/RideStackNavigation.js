import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS, ROUTES_NAMES } from '../constants';
import UserRideHistory from '../pages/user/UserRideHistory';
import RideDetails from '../pages/RideDetails';
import { isDriver } from '../util';
import DriverRideHistory from '../pages/driver/DriverRideHistory';
const Stack = createNativeStackNavigator();

export default function RideStackNavigation({ navigation, route }) {
    const isDriverLogged = isDriver()
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <Stack.Screen name={ROUTES_NAMES.myRides} options={{ title: 'My Rides' }} component={isDriverLogged ? DriverRideHistory : UserRideHistory} />
            <Stack.Screen
                name={ROUTES_NAMES.rideDetails}
                options={{ title: 'Ride Details' }}
                component={RideDetails}
            />
        </Stack.Navigator>
    );
}
