import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import SearchRidePage from '../pages/SearchRidePage';
import FindCaptain from '../pages/FindCaptainPage';
import ActiveRidePage from '../pages/ActiveRidePage';
import ActiveMapPage from '../pages/ActiveMap';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import AppContainer from '../components/AppContainer';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native';
import { useCancelAllRequestMutation } from '../slices/apiSlice';
import { cancelRideRequest } from '../slices/userSlice';
import CustomButton from '../components/common/CustomButton';

const SearchRidePageContainer = AppContainer(SearchRidePage);
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.findCaptain, ROUTES_NAMES.activeRide];

export default function UserStackNavigator({ navigation, route }) {
  const dispatch = useDispatch();
  const { activeRequest, rideRequests } = useSelector((state) => state.user);
  const [cancelAllRequest] = useCancelAllRequestMutation();
  const handleCancelRequest = () => {
    cancelAllRequest(rideRequests.request_id).unwrap().then((res) => {
      dispatch(cancelRideRequest())
    }).catch((err) => {
      console.log(err)
    })
  }
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
      /> : <>
        <Stack.Screen
          name={ROUTES_NAMES.searchRide}
          options={{ title: 'Find A Ride' }}
          component={SearchRidePageContainer}
        />
        <Stack.Screen
          name={ROUTES_NAMES.findCaptain}
          options={{
            title: 'Captains',
            headerBackVisible: false,
            headerRight: () => {
              return <CustomButton
                onClick={handleCancelRequest}
                styles={{ paddingRight: 0, width: 'auto' }}
                textStyles={{ color: COLORS.brand_yellow }}
                label='Cancel & Back'
              />
            }
          }}
          component={FindCaptain}
        />
      </>
      }

    </Stack.Navigator>
  );
}
