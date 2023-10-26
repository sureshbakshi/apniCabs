import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WalletPage from '../pages/WalletPage';
import { PickARide } from '../pages/PickARide';
import MoreNavigator from './moreNavigation';
import { COLORS, ROUTES_NAMES, TAB_BAR_ICONS } from '../constants';
import { Icon } from '../components/common';
import { AppProvider } from '../context/App.context';
import DriverStackNavigator from './driverStackNavigation';
import { navigate } from '../util/navigationService';
import ChatScreen from '../components/Chat';
import useDriverSocketEvents from '../hooks/useDriverSocketEvents';
import { useEffect, useState } from 'react';
import socket from '../components/common/socket';
import { useSelector } from 'react-redux';
import MyRidePage from '../pages/MyRidesPage';
const Tab = createBottomTabNavigator();

export default function DriverTabNavigator() {
  useDriverSocketEvents()
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
        {/* listeners={{ tabPress: e => navigate(ROUTES_NAMES.activeRide) }} */}
        {/* <Tab.Screen name={ROUTES_NAMES.chat} options={{ title: 'chat' }} component={ChatScreen} /> */}
        <Tab.Screen name={ROUTES_NAMES.pickRide} options={{ title: 'Pick A Ride' }} component={DriverStackNavigator}
        />
        <Tab.Screen name={ROUTES_NAMES.myRides} options={{ title: 'My Rides' }} component={MyRidePage} />
        <Tab.Screen name={ROUTES_NAMES.wallet} options={{ title: 'Wallet' }} component={WalletPage} />
        <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: 'More Details' }} component={MoreNavigator} />
      </Tab.Navigator>
    </AppProvider>
  );
}
