import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoreNavigator from './moreNavigation';
import { COLORS, ROUTES_NAMES, TAB_BAR_ICONS } from '../constants';
import { Icon } from '../components/common';
import DriverStackNavigator from './driverStackNavigation';
import useDriverSocketEvents from '../hooks/useDriverSocketEvents';
import useAppStateListner from '../hooks/useAppStateListner';
import RideStackNavigation from './RideStackNavigation';
import WalletStackNavigator from './walletNavigationStack';
import { debounceHandler, setBugsnagUserInfo } from '../util';
import MyTabBar from './TabBar';
import { useTranslation } from 'react-i18next';
import useLocationWatcher from '../hooks/useLocationWatcher';
import React, { useCallback } from 'react';
import useGetDriverDetails from '../hooks/useGetDriverDetails';
import useCityLookup from '../hooks/useCityLookup';

const Tab = createBottomTabNavigator();

setBugsnagUserInfo()

// This component will re-render on data changes, but it returns null, so it's cheap.
const DriverDataManager = React.memo(() => {
  // const { updateCurrentDriverLocationDetails } = useGetCurrentLocation();
  // const hasVehicle = useSelector(state => !!state.auth.driverInfo?.Vehicle);

  // useEffect(() => {
  //   if (hasVehicle) {
  //     console.log('Driver has vehicle, updating location details');
  //     updateCurrentDriverLocationDetails();
  //   }
  // }, [hasVehicle]);

  return <><LocationWatcherComponent />
    <AppStateComponent />
    <SocketComponent />
    <GetDriverDetailsComponent />
  </>;
});

const LocationWatcherComponent = React.memo(() => {
  useLocationWatcher();
  return null;
});
const GetDriverDetailsComponent = React.memo(() => {
  useGetDriverDetails();
  return null;
});
const SocketComponent = React.memo(() => {
  useDriverSocketEvents();
  return null;
});
const AppStateComponent = React.memo(() => {
  const { onRefresh } = useCityLookup();
  useAppStateListner(debounceHandler(onRefresh, 10000));
  return null;
});


export default function DriverTabNavigator() {
  const { t } = useTranslation()
  const renderTabBar = useCallback((props) => {
    const state = props.navigation.getState();
    const currentRoute = state.routes[state.index];
    // Check wallet tab nested screens
    if (currentRoute.name === ROUTES_NAMES.wallet && currentRoute.state) {
      const walletFocusedScreen = currentRoute.state.routes[currentRoute.state.index]?.name;
      if (walletFocusedScreen === ROUTES_NAMES.paymentWebView || walletFocusedScreen === ROUTES_NAMES.myPlans) {
        return null;
      }
    }

    return <MyTabBar {...props} />;
  }, []);
  return (
    <>
      <DriverDataManager />
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
        tabBar={renderTabBar}
        screenListeners={({ navigation, route }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(route.name);
          },
        })}
        detachInactiveScreens={false}
      >
        <Tab.Screen name={ROUTES_NAMES.pickRide} options={{ title: t('home') }} component={DriverStackNavigator}
        />
        <Tab.Screen name={ROUTES_NAMES.rideHistoryStack} options={{ title: t('rides') }} component={RideStackNavigation} />
        <Tab.Screen name={ROUTES_NAMES.wallet} options={{ title: t('wallet') }} component={WalletStackNavigator} />
        <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: t('more') }} component={MoreNavigator} />
      </Tab.Navigator>
    </>
  );
}
