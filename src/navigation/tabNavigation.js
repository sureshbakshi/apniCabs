import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GeoLocationScreen from '../components/GeoLocation';
import HomeScreen from '../components/HomeScreen';
const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Geolocation" component={GeoLocationScreen} />
    </Tab.Navigator>
  );
}
