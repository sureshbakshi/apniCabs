import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import SearchRidePage from '../pages/SearchRidePage';
import FindCaptain from '../pages/FindCaptainPage';
import ActiveRidePage from '../pages/ActiveRidePage';
import { COLORS, RideStatus, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import AppContainer from '../components/AppContainer';
import { useSelector } from 'react-redux';

import CustomButton from '../components/common/CustomButton';
// import useCancelAllRequest from '../hooks/useCancelAllRequest';
import { useRequestAlertHandler } from '../hooks/useActiveRequestBackHandler';
import useGetUserActiveRequests from '../hooks/useGetUserActiveRequests';
import CommonStyles from '../styles/commonStyles';
import SelectOnPage from '../pages/selectonMap';
import { useTranslation } from 'react-i18next';
import HeaderBackButton from '../components/common/HeaderBackButton';
import ChatUI from '../components/common/chat';
import { isDriver } from '../util';

const SearchRidePageContainer = AppContainer(SearchRidePage);
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.activeRide];

export default function UserStackNavigator({ navigation, route }) {
  const { t } = useTranslation();
  const { activeRequestInfo, activeRequestId } = useSelector((state) => state.user);
  const { rideRequests } = useSelector(state => state.user);
  const { requestAlertHandler } = useRequestAlertHandler(t('cancel_request'));
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

  console.log('isActiveRequest', { activeRequestInfo }, isActiveRide)
  // console.log('isActiveRide', activeRequestInfo)
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          ...CommonStyles.headerFont
        },
        headerShown: false,
      }}>
      {/* <Stack.Screen
        name={ROUTES_NAMES.activeMap}
        options={{ title: 'Maps' }}
        component={ActiveMapPage}
      /> */}
      {isActiveRide ? <>
        <Stack.Screen
        name={ROUTES_NAMES.activeRide}
        options={{ title: 'Active Ride' }}
        component={ActiveRidePage}
      /> 
      <Stack.Screen
        name={ROUTES_NAMES.chat}
        options={{
          title: isDriver()?'Chat with user':'Chat with driver',
          // headerLeft: () => <HeaderBackButton />,
          headerShown: true
        }}
        component={ChatUI}
      />
      </>:
        isActiveRequest ?
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
          /> : <Stack.Screen
            name={ROUTES_NAMES.searchRide}
            options={{ title: '', headerShown: false }}
            component={SearchRidePageContainer}
          />
      }
      <Stack.Screen
        name={ROUTES_NAMES.selectonMap}
        component={SelectOnPage}
      />
      

    </Stack.Navigator>
  );
}
