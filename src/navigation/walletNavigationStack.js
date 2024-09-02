import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import WalletPage from '../pages/WalletPage';
import SubscriptionPlans from '../pages/MyPlans';
import CommonStyles from '../styles/commonStyles'
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.myPlans, ROUTES_NAMES.payment];

export default function WalletStackNavigator({ navigation, route }) {
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
          ...CommonStyles.headerFont,
        },
      }}>
      <Stack.Screen name="My Wallet" component={WalletPage} options={{ headerShown: false }} c />
      <Stack.Screen
        name={ROUTES_NAMES.myPlans}
        options={{ title: 'Subscription plans' }}
        component={SubscriptionPlans}
      />
      {/* <Stack.Screen
        name={ROUTES_NAMES.payment}
        component={PaymentScreen}
      /> */}
    </Stack.Navigator>
  );
}
