import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GeoLocationScreen from '../components/GeoLocation';
import HomeScreen from '../components/HomeScreen';
const Stack = createNativeStackNavigator();

function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Geolocation" component={GeoLocationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
  export default App;