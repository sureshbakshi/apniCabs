// driverStackNavigation.tsx
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ActiveRidePage from '../pages/ActiveRidePage';
import { PickARide } from '../pages/PickARide';
import AppContainer from '../components/AppContainer';
import MessageInfo from '../components/common/MessageInfo';
import Notifications from '../components/common/Notifications';
import ServiceUnavailableScreen from '../pages/ServiceUnavailableScreen';
import ChatUI from '../components/common/chat';
import HeaderBackButton from '../components/common/HeaderBackButton';
import CommonStyles from '../styles/commonStyles';
import { COLORS, ROUTES_NAMES } from '../constants';
import { isDriverVerified } from '../util';
import useGetDriverActiveRequests from '../hooks/useGetDriverActiveRequests';

const Stack = createNativeStackNavigator();

const DriverHome = (props) => {
  const { activeRequestInfo } = useSelector((state) => state.driver);
  const hasActiveRequest = !!activeRequestInfo?.id;
  return hasActiveRequest ? <ActiveRidePage {...props} /> : <PickARide {...props} />;
};

const DriverHomePageContainer = AppContainer(DriverHome);

export default function DriverStackNavigator({ navigation }) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { serviceUnavailable } = useSelector(
    (state) => state.driver,
  );
  const { driverInfo } = useSelector((state) => state.auth);

  // Keep this hook – it populates activeRequestInfo / serviceUnavailable
  useGetDriverActiveRequests();

  const needsVerification =
    !!driverInfo &&
    (!isDriverVerified(driverInfo) || isEmpty(driverInfo?.Vehicle));

  // ✅ Decide initial route from current Redux state
  const initialRouteName =
    serviceUnavailable
      ? ROUTES_NAMES.serviceUnavailable
      : needsVerification
        ? ROUTES_NAMES.messageInfo
        : ROUTES_NAMES.searchRide;

  // ✅ On focus, correct route if flags changed
  useEffect(() => {
    if (!isFocused) return;

    const state = navigation.getState();
    const currentRoute = state.routes[state.index]?.name;

    console.log('DriverStack focus:', {
      currentRoute,
      serviceUnavailable,
      needsVerification,
    });

    const target =
      serviceUnavailable
        ? ROUTES_NAMES.serviceUnavailable
        : needsVerification
          ? ROUTES_NAMES.messageInfo
          : ROUTES_NAMES.searchRide;

    if (target && target !== currentRoute) {
      // @ts-ignore
      navigation.navigate(target);
    }
  }, [
    isFocused,
    navigation,
    serviceUnavailable,
    needsVerification,
  ]);

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        contentStyle: { backgroundColor: COLORS.white },
        headerTitleStyle: { ...CommonStyles.headerFont },
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton />,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={ROUTES_NAMES.searchRide}
        component={DriverHomePageContainer}
        options={{ title: null, headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES_NAMES.messageInfo}
        component={MessageInfo}
        options={{ title: t('notification'), headerShown: true }}
      />
      <Stack.Screen
        name={ROUTES_NAMES.chat}
        component={ChatUI}
        options={{ title: 'Chat with user', headerShown: true }}
      />
      <Stack.Screen
        name={ROUTES_NAMES.notifications}
        component={Notifications}
        options={{
          title: t('notifications'),
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={ROUTES_NAMES.serviceUnavailable}
        component={ServiceUnavailableScreen}
        options={{
          title: t('serviceUnavailable'),
          headerShown: false,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
