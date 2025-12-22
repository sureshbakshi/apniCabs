import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActiveRidePage from '../pages/ActiveRidePage';
import { COLORS, ROUTES_NAMES } from '../constants';
import isEmpty from 'lodash/isEmpty';
import AppContainer from '../components/AppContainer';
import { PickARide } from '../pages/PickARide';
import { useSelector } from 'react-redux';
import { isDriverVerified } from '../util';
import MessageInfo from '../components/common/MessageInfo';
import Notifications from '../components/common/Notifications';
import useGetDriverActiveRequests from '../hooks/useGetDriverActiveRequests';
import HeaderBackButton from '../components/common/HeaderBackButton';
import CommonStyles from '../styles/commonStyles'
import ChatUI from '../components/common/chat';
import { useTranslation } from 'react-i18next';
import ServiceUnavailableScreen from '../pages/ServiceUnavailableScreen';
const PickARidePageContainer = AppContainer(PickARide);
const ActiveRidePageContainer = AppContainer(ActiveRidePage);

const Stack = createNativeStackNavigator();

export default function DriverStackNavigator({ navigation, route }) {
  const { activeRequestInfo } = useSelector(state => state.driver)
  const { driverInfo } = useSelector(state => state.auth);
  const { t } = useTranslation();

  // console.log({ driverInfo, 'driverstack': !isEmpty(driverInfo), verif: (!isDriverVerified(driverInfo)), empVeh: isEmpty(driverInfo?.vehicle), isValid: ((!isEmpty(driverInfo)) && (!isDriverVerified(driverInfo) || isEmpty(driverInfo?.vehicle))) })
  useGetDriverActiveRequests()
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: COLORS.white },
        headerStyle: {
        },
        headerShown: false,
        headerTitleStyle: {
          ...CommonStyles.headerFont
        },
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderBackButton />,
        headerShadowVisible: false
      }}>
      {activeRequestInfo?.id ? <>
        <Stack.Screen
          name={ROUTES_NAMES.activeRide}
          options={{ title: t('active_ride') }}
          component={ActiveRidePageContainer}
        />
        <Stack.Screen
          name={ROUTES_NAMES.chat}
          options={{
            title: 'Chat with user',
            headerShown: true
          }}
          component={ChatUI}
        />
      </> : ((!isEmpty(driverInfo)) && (!isDriverVerified(driverInfo) || isEmpty(driverInfo?.Vehicle))) ? <Stack.Screen
        name={ROUTES_NAMES.messageInfo}
        options={{ title: t('notification') }}
        component={MessageInfo}
      /> : <Stack.Screen
        name={ROUTES_NAMES.searchRide}
        options={{ title: null }}
        component={PickARidePageContainer}
      />}
      <Stack.Screen
        name={ROUTES_NAMES.notifications}
        options={{ title: t('notifications'), headerShown: true, headerShadowVisible: false }}
        component={Notifications}
      />
      <Stack.Screen
        name={ROUTES_NAMES.serviceUnavailable}
        options={{ title: t('serviceUnavailable'), headerShown: false, headerShadowVisible: false }}
        component={ServiceUnavailableScreen}
      />
    </Stack.Navigator>
  );
}
