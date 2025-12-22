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
import MyTabBar from './TabBar';
import { useTranslation } from 'react-i18next';
import useLocationWatcher from '../hooks/useLocationWatcher';
import React, { useCallback, useEffect } from 'react';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import { useSelector } from 'react-redux';
import useGetDriverDetails from '../hooks/useGetDriverDetails';
import useCityLookup from '../hooks/useCityLookup';

const Tab = createBottomTabNavigator();

setBugsnagUserInfo()

// This component will re-render on data changes, but it returns null, so it's cheap.
const DriverDataManager = React.memo(() => {
  const { onRefresh } = useCityLookup();
  useDriverSocketEvents();
  useAppStateListner(onRefresh);
  useGetDriverDetails();
  const { updateCurrentDriverLocationDetails } = useGetCurrentLocation();
  const hasVehicle = useSelector(state => !!state.auth.driverInfo?.Vehicle);

  useEffect(() => {
    if (hasVehicle) {
      console.log('Driver has vehicle, updating location details');
      updateCurrentDriverLocationDetails();
    }
  }, [hasVehicle]);

  return <LocationWatcherComponent />;
});

const LocationWatcherComponent = React.memo(() => {
  useLocationWatcher();
  return null;
});



export default function DriverTabNavigator() {
  const { t } = useTranslation()
  const renderTabBar = useCallback((props) => <MyTabBar {...props} />, []);
  console.log('Rendering DriverTabNavigator');
  return (
    <AppProvider>
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
        })}
        tabBar={renderTabBar}

      >
        <Tab.Screen name={ROUTES_NAMES.pickRide} options={{ title: t('home') }} component={DriverStackNavigator}
        />
        <Tab.Screen name={ROUTES_NAMES.rideHistoryStack} options={{ title: t('rides') }} component={RideStackNavigation} />
        <Tab.Screen name={ROUTES_NAMES.wallet} options={{ title: t('wallet') }} component={WalletStackNavigator} />
        <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: t('more') }} component={MoreNavigator} />
      </Tab.Navigator>
    </AppProvider>
  );
}
