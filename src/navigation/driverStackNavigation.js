import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActiveRidePage from '../pages/ActiveRidePage';
import { COLORS, ROUTES_NAMES } from '../constants';
import isEmpty from 'lodash/isEmpty';
import AppContainer from '../components/AppContainer';
import { PickARide } from '../pages/PickARide';
import { useSelector } from 'react-redux';
import { isDriverVerified } from '../util';
import MessageInfo from '../components/common/MessageInfo';
import Notifications from '../components/common/Notifications';
import useGetDriverActiveRequests from '../hooks/useGetDriverActiveRequests';
import HeaderBackButton from '../components/common/HeaderBackButton';
import CommonStyles from '../styles/commonStyles';
import ChatUI from '../components/common/chat';
import { useTranslation } from 'react-i18next';
import ServiceUnavailableScreen from '../pages/ServiceUnavailableScreen';
const PickARidePageContainer = AppContainer(PickARide);
const ActiveRidePageContainer = AppContainer(ActiveRidePage);

const Stack = createNativeStackNavigator();

export default function DriverStackNavigator({ navigation, route }) {
  const { activeRequestInfo, serviceUnavailable } = useSelector(state => state.driver);
  const { driverInfo } = useSelector(state => state.auth);
  const { t } = useTranslation();
  useGetDriverActiveRequests();


  // Same conditional logic, now in useEffect
  const hasActiveRequest = !!activeRequestInfo?.id;
  const needsVerification = !isEmpty(driverInfo) &&
    (!isDriverVerified(driverInfo) || isEmpty(driverInfo?.Vehicle));

  useEffect(() => {
    if (serviceUnavailable) {
      navigation.navigate(ROUTES_NAMES.serviceUnavailable);
    } else if (hasActiveRequest) {
      navigation.navigate(ROUTES_NAMES.activeRide);
    } else if (needsVerification) {
      navigation.navigate(ROUTES_NAMES.messageInfo);
    } else {
      navigation.navigate(ROUTES_NAMES.searchRide);
    }
  }, [hasActiveRequest, needsVerification, navigation, serviceUnavailable]);

  // Determine initial route (matches UserStack pattern)
  const initialRouteName = serviceUnavailable
    ? ROUTES_NAMES.serviceUnavailable
    : hasActiveRequest
      ? ROUTES_NAMES.activeRide
      : needsVerification
        ? ROUTES_NAMES.messageInfo
        : ROUTES_NAMES.searchRide;

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
        options={{ title: null, headerShown: false }}
        component={PickARidePageContainer}
      />
      <Stack.Screen
        name={ROUTES_NAMES.messageInfo}
        options={{ title: t('notification'), headerShown: true }}
        component={MessageInfo}
      />
      <Stack.Screen
        name={ROUTES_NAMES.activeRide}
        options={{ title: t('active_ride'), headerShown: true }}
        component={ActiveRidePageContainer}
      />
      <Stack.Screen
        name={ROUTES_NAMES.chat}
        options={{ title: 'Chat with user', headerShown: true }}
        component={ChatUI}
      />
      <Stack.Screen
        name={ROUTES_NAMES.notifications}
        options={{ title: t('notifications'), headerShown: true, headerShadowVisible: false }}
        component={Notifications}
      />
      <Stack.Screen
        name={ROUTES_NAMES.serviceUnavailable}
        options={{ title: t('serviceUnavailable'), headerShown: false, headerShadowVisible: false }}
        component={ServiceUnavailableScreen}
      />
    </Stack.Navigator>
  );
}
