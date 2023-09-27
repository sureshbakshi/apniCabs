import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GeoLocationScreen from '../components/GeoLocation';
// import HomeScreen from '../components/HomeScreen';
import FindRide from '../pages/RidePage';

const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false
    }}>
      <Tab.Screen name="Home" component={FindRide} />
      <Tab.Screen name="Geolocation" component={GeoLocationScreen} />
    </Tab.Navigator>
  );
}
