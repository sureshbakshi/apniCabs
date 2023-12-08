import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ActiveRidePage from '../pages/ActiveRidePage';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import AppContainer from '../components/AppContainer';
import { PickARide } from '../pages/PickARide';
import { useSelector } from 'react-redux';

const PickARidePageContainer = AppContainer(PickARide);
const ActiveRidePageContainer = AppContainer(ActiveRidePage);

const Stack = createNativeStackNavigator();

export default function DriverStackNavigator({ navigation, route }) {
  const { activeRequest } = useSelector(state => state.driver)

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {activeRequest.id? <Stack.Screen
        name={ROUTES_NAMES.activeRide}
        options={{ title: 'Active Ride' }}
        component={ActiveRidePageContainer}
      /> : <Stack.Screen
        name={ROUTES_NAMES.searchRide}
        options={{ title: null }}
        component={PickARidePageContainer}
      />}


    </Stack.Navigator>
  );
}
