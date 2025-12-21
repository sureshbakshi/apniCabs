import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MorePage from '../pages/MorePage';
import MyProfilePage from '../pages/MyProfilePage';
import TermsAndConditionsPage from '../pages/TermsAndConditionsPage';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useEffect } from 'react';
import FareSettings from '../pages/FareSettings';
import Contacts from '../pages/Contacts';
import Refer from '../pages/Refer';
import HeaderBackButton from '../components/common/HeaderBackButton';
import CommonStyles from '../styles/commonStyles'
import LanguagePage from '../pages/LanguagePage';
import { useTranslation } from 'react-i18next';
const Stack = createNativeStackNavigator();
const tabHiddenRoutes = [ROUTES_NAMES.profile, ROUTES_NAMES.terms, ROUTES_NAMES.activeRide];

export default function MoreNavigator({ navigation, route }) {
  const { t } = useTranslation();
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
        contentStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.black,
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton />,
        headerShadowVisible: false,
        headerTitleStyle:{
          ...CommonStyles.headerFont
        }
        // headerTransparent: true
      }}>
      <Stack.Screen name="More Details" component={MorePage} options={{ headerShown: false }} />
      <Stack.Screen
        name="MyProfile"
        options={{ title: t('my_profile') }}
        component={MyProfilePage}
      />
      <Stack.Screen
        name="TermsAndConditions"
        options={{ title: t('terms_and_conditions') }}
        component={TermsAndConditionsPage}
      />
      <Stack.Screen
        name="FareSettings"
        options={{ title: t('fare_settings') }}
        component={FareSettings}
      />
      <Stack.Screen
        name={ROUTES_NAMES.refer}
        options={{
          title: t('refer_now'),
          headerTransparent: true,
        }}
        component={Refer}
      />
      <Stack.Screen
        name={ROUTES_NAMES.contacts}
        options={{ title: t('contacts') }}
        component={Contacts}
      />
       <Stack.Screen
        name={ROUTES_NAMES.language}
        options={{ title: t('language') }}
        component={LanguagePage}
      />
    </Stack.Navigator>
  );
}
