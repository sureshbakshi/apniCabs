import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MorePage from '../pages/MorePage';
import MyProfilePage from '../pages/MyProfilePage';
import TermsAndConditionsPage from '../pages/TermsAndConditionsPage';
import { COLORS } from '../constants';
import { useEffect } from 'react';
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = ['MyProfile', 'TermsAndConditions'];

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
    </Stack.Navigator>
  );
}
