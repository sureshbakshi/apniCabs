import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserStackNavigator from './userStackNavigation';
import WalletPage from '../pages/WalletPage';
import MyRidePage from '../pages/MyRidesPage';
import MoreNavigator from './moreNavigation';
import { COLORS, ROUTES_NAMES, TAB_BAR_ICONS } from '../constants';
import { Icon } from '../components/common';
import { AppProvider } from '../context/App.context';
import useUserSocketEvents from '../hooks/useUserSocketEvents';
import UserRideHistory from '../pages/user/UserRideHistory';
import { useActiveRequestBackHandler } from '../hooks/useActiveRequestBackHandler';
import { useEffect } from 'react';
import useValidateRequestExpiry from '../hooks/useValidateRequestExpiry';
import { AppState } from 'react-native';
import useLocalNotifications from '../hooks/useLocalNotifications';

const Tab = createBottomTabNavigator();
export default function UserTabNavigator() {
  useUserSocketEvents();
  useLocalNotifications()
  useHandleDeeplinks()
  useActiveRequestBackHandler();

  const { validateRequestExpiry } = useValidateRequestExpiry();


  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'active') {
          validateRequestExpiry();
        }
        console.log('Next AppState is: ', nextAppState);
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);
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
          component={UserStackNavigator}
        />
        <Tab.Screen name={ROUTES_NAMES.myRides} options={{ title: 'My Rides' }} component={UserRideHistory} />
        {/* <Tab.Screen name={ROUTES_NAMES.wallet} options={{ title: 'Wallet' }} component={WalletPage} /> */}
        <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: 'More Details' }} component={MoreNavigator} />
      </Tab.Navigator>
    </AppProvider>
  );
}
