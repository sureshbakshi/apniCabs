import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FindRideNavigator from './findRideNavigation';
import WalletPage from '../pages/WalletPage';
import MyRidePage from '../pages/MyRidesPage';
import MoreNavigator from './moreNavigation';
import { COLORS, ROUTES_NAMES, TAB_BAR_ICONS } from '../constants';
import { Icon } from '../components/common';
import { AppProvider } from '../context/App.context';
const Tab = createBottomTabNavigator();
export default function TabNavigator() {
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
        <Tab.Screen
          name={ROUTES_NAMES.findRide}
          options={{ title: 'Find a Ride' }}
          component={FindRideNavigator}
        />
        <Tab.Screen name={ROUTES_NAMES.myRides} options={{ title: 'My Rides' }} component={MyRidePage} />
        <Tab.Screen name={ROUTES_NAMES.wallet} options={{ title: 'Wallet' }} component={WalletPage} />
        <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: 'More Details' }} component={MoreNavigator} />
      </Tab.Navigator>
    </AppProvider>
  );
}
