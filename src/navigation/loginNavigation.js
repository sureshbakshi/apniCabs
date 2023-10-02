import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
const Stack = createNativeStackNavigator();

export default function LoginNavigator({navigation, route}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
        headerStyle: {
          marginBottom: 50,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation:'slide_from_right'
      }}>
      <Stack.Screen
        name="SignIn"
        options={{title: 'Sign In'}}
        component={LoginPage}
      />
      <Stack.Screen
        name="SignUp"
        options={{title: 'Sign Up'}}
        component={SignUpPage}
      />
    </Stack.Navigator>
  );
}
