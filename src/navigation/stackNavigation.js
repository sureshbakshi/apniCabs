import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GeoLocationScreen from '../components/GeoLocation';
// import HomeScreen from '../components/HomeScreen';
import FindRide from '../pages/RidePage';
import TabNavigator from './tabNavigation';
const Stack = createNativeStackNavigator();
export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Profile" component={TabNavigator}/>
      <Stack.Screen name="Home" component={FindRide} />
      <Stack.Screen name="Geolocation" component={GeoLocationScreen} />
    </Stack.Navigator>
  );
}
