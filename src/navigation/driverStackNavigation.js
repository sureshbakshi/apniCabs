import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ActiveRidePage from '../pages/ActiveRidePage';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import AppContainer from '../components/AppContainer';
import { PickARide } from '../pages/PickARide';
import { useSelector } from 'react-redux';

const PickARidePageContainer = AppContainer(PickARide);

const Stack = createNativeStackNavigator();

export default function DriverStackNavigator({ navigation, route }) {
  const { activeRequestId } = useSelector(state => state.driver)

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
      {activeRequestId ? <Stack.Screen
        name={ROUTES_NAMES.activeRide}
        options={{ title: 'Active Ride' }}
        component={ActiveRidePage}
      /> : <Stack.Screen
        name={ROUTES_NAMES.searchRide}
        options={{ title: null }}
        component={PickARidePageContainer}
      />}


    </Stack.Navigator>
  );
}
