import React, {useContext} from 'react';
import {Text, View, TextInput, Pressable, ImageBackground} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import {useSetState} from 'react-use';
import {AuthContext} from '../context/Auth.context';
const initialState = {
  email: '',
  password: '',
};
const LoginPage = ({navigation}) => {
  const {state: ContextState, login} = useContext(AuthContext);
  const {isLoginPending, isLoggedIn, loginError} = ContextState;
  const [state, setState] = useSetState(initialState);
  const onSubmit = e => {
    const {email, password} = state;
    login(email, password);
    setState({
      email: '',
      password: '',
    });
  };
  return (
    <View style={LoginStyles.container}>
      <ImageBackground
        source={require('../assets/images/bg.jpeg')}
        resizeMode="cover"
        style={LoginStyles.image}>
        <View style={LoginStyles.logoSection}>
          <Text style={LoginStyles.logoTxt}>{'Apni Cabs'.toUpperCase()}</Text>
        </View>
      </ImageBackground>

      <View style={LoginStyles.section}>
        <View>
          <TextInput
            placeholder="Phone Number"
            onChangeText={newText => setState({email: newText})}
            value={state.email}
            style={LoginStyles.textInputPickup}
          />
          <TextInput
            placeholder="Password"
            onChangeText={newText => setState({password: newText})}
            value={state.password}
            style={LoginStyles.textInputDrop}
          />
          <View>
            {isLoginPending && <Text>Please wait...</Text>}
            {isLoggedIn && <Text>Success.</Text>}
            {loginError && (
              <Text style={[CommonStyles.errorTxt, CommonStyles.mb5]}>
                {loginError.message}
              </Text>
            )}
          </View>
          <View>
            <Pressable
              style={LoginStyles.button}
              android_ripple={{color: '#fff'}}
              onPress={() => onSubmit()}>
              <Text style={LoginStyles.text}>{'Login'.toUpperCase()}</Text>
            </Pressable>
          </View>
          <View style={LoginStyles.signUpContainer}>
            <View style={LoginStyles.signUpSection}>
              <Text style={LoginStyles.headerText}>New user?</Text>
              <Pressable
                android_ripple={{color: '#fff'}}
                onPress={() => navigation.navigate('SignUp')}>
                <Text style={LoginStyles.greenTxt}>SignUp</Text>
              </Pressable>
            </View>
            <View style={LoginStyles.forgotSection}>
              <Text style={LoginStyles.headerText}>Forgot</Text>
              <Text style={LoginStyles.greenTxt}>Password?</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={[LoginStyles.headerText, CommonStyles.mb10]}>
            {'or continue with '.toUpperCase()}
          </Text>
          <Pressable
            style={LoginStyles.googleBtn}
            android_ripple={{color: '#ccc'}}>
            <Text style={LoginStyles.googleTxt}>{'Google'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default LoginPage;
