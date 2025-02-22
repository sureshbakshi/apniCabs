import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import { COLORS, ROUTES_NAMES } from '../constants';
import OTPAutoFill from '../components/OTPAutoFill';
import GettingStartedPage from '../pages/GettingStartedPage';
import CommonStyles from '../styles/commonStyles'
import { useTranslation } from 'react-i18next';
const Stack = createNativeStackNavigator();

export default function LoginNavigator({navigation, route}) {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
        headerStyle: {
          marginBottom: 50,
        },
        headerTitleStyle:{
          ...CommonStyles.headerFont
        },
        headerShown:false,
        animation:'slide_from_right'
      }}>
        <Stack.Screen
        name={ROUTES_NAMES.gettingStartedPage}
        options={{title: ''}}
        component={GettingStartedPage}
      />
        <Stack.Screen
          name={ROUTES_NAMES.signIn}
          options={{title: ''}}
          component={LoginPage}
        />
      <Stack.Screen
        name={ROUTES_NAMES.signUp}
        options={{title: t('sign_up')}}
        component={SignUpPage}
      />
      <Stack.Screen
        name={ROUTES_NAMES.otp}
        options={{title: t('submit_otp'), headerTintColor: COLORS.primary}}
        component={OTPAutoFill}
      />
    </Stack.Navigator>
  );
}
