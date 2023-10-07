import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import SearchRidePage from '../pages/SearchRidePage';
import FindCaptain from '../pages/FindCaptainPage';
import { COLORS } from '../constants';
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = ['FindCaptain'];

export default function FindRideNavigator({navigation, route}) {
  if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
    navigation.setOptions({tabBarStyle: {display: 'none'}});
  } else {
    navigation.setOptions({tabBarStyle: {display: 'flex'}});
  }
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
        name="SearchRide"
        options={{title: 'Find A Ride'}}
        component={SearchRidePage}
      />
      <Stack.Screen
        name="FindCaptain"
        options={{title: 'Captains'}}
        component={FindCaptain}
      />
    </Stack.Navigator>
  );
}
