import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import SearchRidePage from '../pages/SearchRidePage';
import FindCaptain from '../pages/FindCaptainPage';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import AppContainer from '../components/AppContainer';

const SearchRidePageContainer = AppContainer(SearchRidePage);

const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.findCaptain];

export default function FindRideNavigator({ navigation, route }) {
  useEffect(() => {
    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route])
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
      <Stack.Screen
        name={ROUTES_NAMES.searchRide}
        options={{ title: 'Find A Ride' }}
        component={SearchRidePageContainer}
      />
      <Stack.Screen
        name={ROUTES_NAMES.findCaptain}
        options={{ title: 'Captains' }}
        component={FindCaptain}
      />
    </Stack.Navigator>
  );
}
