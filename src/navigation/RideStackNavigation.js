import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS, ROUTES_NAMES } from '../constants';
import UserRideHistory from '../pages/user/UserRideHistory';
import RideDetails from '../pages/RideDetails';
import { isDriver } from '../util';
import DriverRideHistory from '../pages/driver/DriverRideHistory';
import CommonStyles from '../styles/commonStyles';
import HeaderBackButton from '../components/common/HeaderBackButton';
import { useTranslation } from 'react-i18next';
const Stack = createNativeStackNavigator();

export default function RideStackNavigation({ navigation, route }) {
    const isDriverLogged = isDriver();
    const {t} = useTranslation();

    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: COLORS.black,
                headerTitleStyle: {
                    ...CommonStyles.headerFont
                },
                headerTitleAlign: 'center',
            }}>
            <Stack.Screen name={ROUTES_NAMES.myRides} options={{ title: t('my_rides'), headerShown: false }} component={isDriverLogged ? DriverRideHistory : UserRideHistory} />
            <Stack.Screen
                name={ROUTES_NAMES.rideDetails}
                options={{
                    title: t('ride_details'),
                    headerLeft: () => <HeaderBackButton />,
                    headerShadowVisible: false
                }}
                component={RideDetails}
            />
        </Stack.Navigator>
    );
}
