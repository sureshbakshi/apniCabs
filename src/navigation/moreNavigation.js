import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import MorePage from '../pages/MorePage';
import MyProfilePage from '../pages/MyProfilePage';
import TermsAndConditionsPage from '../pages/TermsAndConditionsPage';
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = ['MyProfile', 'TermsAndConditions'];

export default function MoreNavigator({navigation, route}) {
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
      <Stack.Screen name="More" component={MorePage} />
      <Stack.Screen
        name="MyProfile"
        options={{title: 'My Profile'}}
        component={MyProfilePage}
      />
      <Stack.Screen
        name="TermsAndConditions"
        options={{title: 'Terms And Conditions'}}
        component={TermsAndConditionsPage}
      />
    </Stack.Navigator>
  );
}
