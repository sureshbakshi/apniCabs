import React, { useCallback, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchRidePage from '../pages/SearchRidePage';
import FindCaptain from '../pages/FindCaptainPage';
import ActiveRidePage from '../pages/ActiveRidePage';
import { COLORS, RideStatus, ROUTES_NAMES } from '../constants';
import AppContainer from '../components/AppContainer';
import { useSelector } from 'react-redux';

import CustomButton from '../components/common/CustomButton';
// import useCancelAllRequest from '../hooks/useCancelAllRequest';
import { useRequestAlertHandler } from '../hooks/useActiveRequestBackHandler';
import useGetUserActiveRequests from '../hooks/useGetUserActiveRequests';
import CommonStyles from '../styles/commonStyles';
import SelectOnPage from '../pages/selectonMap';
import { useTranslation } from 'react-i18next';
import ChatUI from '../components/common/chat';
import { useIsFocused } from '@react-navigation/native';

const SearchRidePageContainer = AppContainer(SearchRidePage);
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.activeRide];

export default function UserStackNavigator({ navigation, route }) {
  const { t } = useTranslation();
  const { activeRequestInfo, activeRequestId } = useSelector((state) => state.user);
  const { requestAlertHandler } = useRequestAlertHandler(t('cancel_request'));
  const isFocused = useIsFocused(); // ✅ stack focus
  useGetUserActiveRequests()
  // useEffect(() => {
  //   if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
  //     navigation.setOptions({ tabBarStyle: { display: 'none' } });
  //   } else {
  //     navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  //   }
  // }, [navigation, route]);
  const status = activeRequestInfo?.status;
  const isActiveRide = [RideStatus.ONRIDE, RideStatus.ACCEPTED].includes(status);
  const isActiveRequest = [RideStatus.INITIATED, RideStatus.REQUESTED].includes(status);

  useEffect(() => {
    if (!isFocused) return;
    const state = navigation.getState();
    const currentRoute = state.routes[state.index]?.name;
    if (isActiveRide && currentRoute !== ROUTES_NAMES.activeRide) {
      navigation.navigate(ROUTES_NAMES.activeRide);
    } else if (isActiveRequest && currentRoute !== ROUTES_NAMES.findCaptain) {
      navigation.navigate(ROUTES_NAMES.findCaptain);
    } else if (!isActiveRide && !isActiveRequest && currentRoute !== ROUTES_NAMES.searchRide) {
      navigation.navigate(ROUTES_NAMES.searchRide);
    }
  }, [isActiveRide, isActiveRequest, navigation, isFocused])


  return (
    <Stack.Navigator
      initialRouteName={isActiveRide ? ROUTES_NAMES.activeRide : isActiveRequest ? ROUTES_NAMES.findCaptain : ROUTES_NAMES.searchRide}
      screenOptions={{
        contentStyle: { backgroundColor: COLORS.white },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          ...CommonStyles.headerFont
        },
        headerShown: false,
      }}>
      <Stack.Screen
        name={ROUTES_NAMES.searchRide}
        options={{ title: '', headerShown: false }}
        component={SearchRidePageContainer}
      />
      <Stack.Screen
        name={ROUTES_NAMES.findCaptain}
        options={{
          title: 'Captains',
          headerBackVisible: false,
          headerRight: () => {
            return <CustomButton
              onClick={requestAlertHandler}
              styles={{ paddingRight: 0, width: 'auto' }}
              textStyles={{ color: COLORS.brand_yellow, fontSize: 18 }}
              label={t('cancel_all_btn')}
              isLowerCase={true}
            />
          }
        }}
        component={FindCaptain}
      />
      <Stack.Screen
        name={ROUTES_NAMES.activeRide}
        options={{ title: t('active_ride') }}
        component={ActiveRidePage}
      />
      <Stack.Screen
        name={ROUTES_NAMES.chat}
        options={{
          title: 'Chat with driver',
          // headerLeft: () => <HeaderBackButton />,
          headerShown: true
        }}
        component={ChatUI}
      />
      <Stack.Screen
        name={ROUTES_NAMES.selectonMap}
        component={SelectOnPage}
      />


    </Stack.Navigator>
  );
}
