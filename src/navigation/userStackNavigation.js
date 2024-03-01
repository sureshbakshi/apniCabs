import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import SearchRidePage from '../pages/SearchRidePage';
import FindCaptain from '../pages/FindCaptainPage';
import ActiveRidePage from '../pages/ActiveRidePage';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import AppContainer from '../components/AppContainer';
import { useSelector } from 'react-redux';

import CustomButton from '../components/common/CustomButton';
// import useCancelAllRequest from '../hooks/useCancelAllRequest';
import { useRequestAlertHandler } from '../hooks/useActiveRequestBackHandler';
import useGetUserActiveRequests from '../hooks/useGetUserActiveRequests';

const SearchRidePageContainer = AppContainer(SearchRidePage);
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.activeRide];

export default function UserStackNavigator({ navigation, route }) {

  const { activeRequest } = useSelector((state) => state.user);
  const { rideRequests } = useSelector(state => state.user);
  const { requestAlertHandler } = useRequestAlertHandler('Cancel!', `Would you like to cancel it? If you click 'Yes', your request will be cancelled.`);
  useGetUserActiveRequests()
  useEffect(() => {
    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {/* <Stack.Screen
        name={ROUTES_NAMES.activeMap}
        options={{ title: 'Maps' }}
        component={ActiveMapPage}
      /> */}
      {activeRequest?.id ? <Stack.Screen
        name={ROUTES_NAMES.activeRide}
        options={{ title: 'Active Ride' }}
        component={ActiveRidePage}
      /> :
        rideRequests?.vehicles ?
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
                  label={`Cancel All`}
                  isLowerCase={true}
                />
              }
            }}
            component={FindCaptain}
          /> : <Stack.Screen
            name={ROUTES_NAMES.searchRide}
            options={{ title: 'Find A Ride' }}
            component={SearchRidePageContainer}
          />
      }

    </Stack.Navigator>
  );
}
