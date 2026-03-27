import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserStackNavigator from './userStackNavigation';
import MoreNavigator from './moreNavigation';
import { COLORS, ROUTES_NAMES, TAB_BAR_ICONS } from '../constants';
import { Icon } from '../components/common';
import useUserSocketEvents from '../hooks/useUserSocketEvents';
import { useActiveRequestBackHandler } from '../hooks/useActiveRequestBackHandler';
import useValidateRequestExpiry from '../hooks/useValidateRequestExpiry';
import useAppStateListner from '../hooks/useAppStateListner';
import RideStackNavigation from './RideStackNavigation';
import { setBugsnagUserInfo } from '../util';
import MyTabBar from './TabBar';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
setBugsnagUserInfo()

const Tab = createBottomTabNavigator();
export default function UserTabNavigator() {
  useUserSocketEvents();
  useActiveRequestBackHandler();

  const { validateRequestExpiry } = useValidateRequestExpiry();
  
  const handleAppStateChange = useCallback((nextAppState) => {
    if (nextAppState === 'active') {
      validateRequestExpiry();
    }
  }, [validateRequestExpiry]);

  useAppStateListner(handleAppStateChange)
  const { t } = useTranslation()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused ? TAB_BAR_ICONS[route.name][0] : TAB_BAR_ICONS[route.name][1]
          return <Icon name={iconName} size={'large'} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarHideOnKeyboard: true,
        lazy: false
      })}

      detachInactiveScreens={false}
      tabBar={(props) => <MyTabBar {...props} />}
      screenListeners={({ navigation, route }) => ({
        tabPress: e => {
          // 👇 prevent default behavior (pop to first screen)
          e.preventDefault();

          // Manually navigate to tab root WITHOUT resetting stack
          if (route.name === ROUTES_NAMES.findRide) {
            navigation.navigate(ROUTES_NAMES.findRide);
          } else {
            navigation.navigate(route.name);
          }
        },
      })}
    >
      <Tab.Screen
        name={ROUTES_NAMES.findRide}
        options={{ title: t('home') }}
        component={UserStackNavigator}
      />
      <Tab.Screen name={ROUTES_NAMES.rideHistoryStack} options={{ title: t('rides') }} component={RideStackNavigation} />
      {/* <Tab.Screen name={ROUTES_NAMES.wallet} options={{ title: 'Wallet' }} component={WalletPage} /> */}
      <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: t('more') }} component={MoreNavigator} />
    </Tab.Navigator>
  );
}
