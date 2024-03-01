import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActiveRidePage from '../pages/ActiveRidePage';
import { COLORS, ROUTES_NAMES } from '../constants';
import { isEmpty } from 'lodash';
import AppContainer from '../components/AppContainer';
import { PickARide } from '../pages/PickARide';
import { useSelector } from 'react-redux';
import { isDriverVerified } from '../util';
import MessageInfo from '../components/common/MessageInfo';
import Notifications from '../components/common/Notifications';
import useGetDriverActiveRequests from '../hooks/useGetDriverActiveRequests';

const PickARidePageContainer = AppContainer(PickARide);
const ActiveRidePageContainer = AppContainer(ActiveRidePage);

const Stack = createNativeStackNavigator();

export default function DriverStackNavigator({ navigation, route }) {
  const { activeRequest } = useSelector(state => state.driver)
  const { driverInfo } = useSelector(state => state.auth);
  useGetDriverActiveRequests()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {activeRequest?.id ? <Stack.Screen
        name={ROUTES_NAMES.activeRide}
        options={{ title: 'Active Ride' }}
        component={ActiveRidePageContainer}
      /> : (!isEmpty(driverInfo) && !isDriverVerified(driverInfo)) ? <Stack.Screen
        name={ROUTES_NAMES.messageInfo}
        options={{ title: null }}
        component={MessageInfo}
      /> : <Stack.Screen
        name={ROUTES_NAMES.searchRide}
        options={{ title: null }}
        component={PickARidePageContainer}
      />}
      <Stack.Screen
        name={ROUTES_NAMES.notifications}
        options={{ title: 'Notifications', headerShown: true }}
        component={Notifications}
      />



    </Stack.Navigator>
  );
}
