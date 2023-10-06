import React, {useContext} from 'react';
import {Text, View, TextInput, Pressable, ImageBackground} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import {useSetState} from 'react-use';
import {AuthContext} from '../context/Auth.context';
import {navigate} from '../util/navigationService';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
const initialState = {
  email: '',
  password: '',
};

GoogleSignin.configure({
  androidClientId:
    '393986381460-35bfecvib0g66i2dgpr9htaa1vb3s563.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const LoginPage = () => {
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

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      const {email} = userInfo.user;
      login(email);
      setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={LoginStyles.container}>
      <ImageBackground
        source={require('../assets/images/bg.jpeg')}
        resizeMode="cover"
        style={LoginStyles.image}>
        <View style={LoginStyles.logoSection}>
          <Text style={LoginStyles.logoTxt}>{'Apni Cabi'.toUpperCase()}</Text>
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
                onPress={() => navigate('SignUp')}>
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
          <GoogleSigninButton
            style={{width: '100%', height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
          />
          {false && (
            <Pressable
              style={LoginStyles.googleBtn}
              android_ripple={{color: '#ccc'}}>
              <Text style={LoginStyles.googleTxt}>{'Google'}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};
export default LoginPage;
