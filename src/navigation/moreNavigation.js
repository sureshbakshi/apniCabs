import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MorePage from '../pages/MorePage';
import MyProfilePage from '../pages/MyProfilePage';
import TermsAndConditionsPage from '../pages/TermsAndConditionsPage';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import FareSettings from '../pages/FareSettings';
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.profile, ROUTES_NAMES.terms, ROUTES_NAMES.activeRide];

export default function MoreNavigator({ navigation, route }) {
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
      <Stack.Screen name="More" component={MorePage} />
      <Stack.Screen
        name="MyProfile"
        options={{ title: 'My Profile' }}
        component={MyProfilePage}
      />
      <Stack.Screen
        name="TermsAndConditions"
        options={{ title: 'Terms And Conditions' }}
        component={TermsAndConditionsPage}
      />
      <Stack.Screen
        name="FareSettings"
        options={{ title: 'Fare Settings' }}
        component={FareSettings}
      />
    </Stack.Navigator>
  );
}
