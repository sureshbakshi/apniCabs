import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import SearchRidePage from '../pages/SearchRidePage';
import FindRidePage from '../pages/FindRidePage';
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = ['Find A Ride'];

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
          backgroundColor: '#11c874',
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
        name="FindRide"
        options={{title: 'Find A Ride'}}
        component={FindRidePage}
      />
    </Stack.Navigator>
  );
}
