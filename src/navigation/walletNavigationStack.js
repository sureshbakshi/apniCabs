import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useLayoutEffect } from 'react';
import WalletPage from '../pages/WalletPage';
import SubscriptionPlans from '../pages/MyPlans';
import PaymentPage from '../pages/PaymentPage';
import CommonStyles from '../styles/commonStyles'
import HeaderBackButton from '../components/common/HeaderBackButton';
import { useTranslation } from 'react-i18next';
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.myPlans, ROUTES_NAMES.payment, ROUTES_NAMES.webView];

export default function WalletStackNavigator({ navigation, route }) {
  const {t} = useTranslation()
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (tabHiddenRoutes.includes(routeName)) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route])
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.black,
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton />,
        headerShadowVisible: false,
        headerTitleStyle:{
          ...CommonStyles.headerFont
        }
      }}
      >
      <Stack.Screen name="My Wallet" component={WalletPage} options={{ headerShown: false }} c />
      <Stack.Screen
        name={ROUTES_NAMES.myPlans}
        options={{ title: t('subscription_plans') }}
        component={SubscriptionPlans}
      />
      <Stack.Screen
        name={ROUTES_NAMES.paymentWebView}
        component={PaymentPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
