import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FindRideNavigator from './findRideNavigation';
import WalletPage from '../pages/WalletPage';
import MyRidePage from '../pages/MyRidesPage';
import MoreNavigator from './moreNavigation';
const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="My Rides" component={MyRidePage} />
      <Tab.Screen
        name="FindRide"
        options={{title: 'Find a Ride'}}
        component={FindRideNavigator}
      />
      <Tab.Screen name="Wallet" component={WalletPage} />
      <Tab.Screen name="More" component={MoreNavigator} />
    </Tab.Navigator>
  );
}
