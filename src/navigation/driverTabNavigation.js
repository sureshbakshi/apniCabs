import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoreNavigator from './moreNavigation';
import { COLORS, ROUTES_NAMES, TAB_BAR_ICONS } from '../constants';
import { Icon } from '../components/common';
import { AppProvider } from '../context/App.context';
import DriverStackNavigator from './driverStackNavigation';
import useDriverSocketEvents from '../hooks/useDriverSocketEvents';
import useAppStateListner from '../hooks/useAppStateListner';
import RideStackNavigation from './RideStackNavigation';
import WalletStackNavigator from './walletNavigationStack';
import { setBugsnagUserInfo } from '../util';
const Tab = createBottomTabNavigator();

setBugsnagUserInfo()


export default function DriverTabNavigator() {
  useDriverSocketEvents()
  useAppStateListner()
  return (
    <AppProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? TAB_BAR_ICONS[route.name][0] : TAB_BAR_ICONS[route.name][1]
            return <Icon name={iconName} size={'large'} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 }

        })}
      >
        <Tab.Screen name={ROUTES_NAMES.pickRide} options={{ title: 'Pick A Ride' }} component={DriverStackNavigator}
        />
        <Tab.Screen name={ROUTES_NAMES.rideHistoryStack} options={{ title: 'My Rides' }} component={RideStackNavigation} />
        <Tab.Screen name={ROUTES_NAMES.wallet} options={{ title: 'Wallet' }} component={WalletStackNavigator} />
        <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: 'More Details' }} component={MoreNavigator} />
      </Tab.Navigator>
    </AppProvider>
  );
}
