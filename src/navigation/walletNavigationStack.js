import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS, ROUTES_NAMES } from '../constants';
import WalletPage from '../pages/WalletPage';
import SubscriptionPlans from '../pages/MyPlans';
import PaymentPage from '../pages/PaymentPage';
import CommonStyles from '../styles/commonStyles'
import HeaderBackButton from '../components/common/HeaderBackButton';
import { useTranslation } from 'react-i18next';
const Stack = createNativeStackNavigator();

export default function WalletStackNavigator({ navigation, route }) {
  const { t } = useTranslation()

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.black,
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton />,
        headerShadowVisible: false,
        headerTitleStyle: {
          ...CommonStyles.headerFont
        }
      }}
    >
      <Stack.Screen name={ROUTES_NAMES.transactions} component={WalletPage} options={{ headerShown: false }} />
      <Stack.Screen
        name={ROUTES_NAMES.myPlans}
        options={{ title: t('subscription_plans') }}
        component={SubscriptionPlans}
      />
      <Stack.Screen
        name={ROUTES_NAMES.paymentWebView}
        component={PaymentPage}
        options={{ headerShown: false , title: t('payment') }}
      />
    </Stack.Navigator>
  );
}
