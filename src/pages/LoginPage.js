import React, {useEffect} from 'react';
import {
  View,
  TextInput,
  Pressable,
  ImageBackground,
  ScrollView,
  Linking,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import {useSetState} from 'react-use';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Text} from '../components/common';
import {COLORS} from '../constants';
import {useDispatch} from 'react-redux';
import {
  updateGoogleUserInfo,
  updateLoginToken,
  updateUserCheck,
} from '../slices/authSlice';
import {useLoginMutation, useUserCheckMutation} from '../slices/apiSlice';
import {getConfig, showErrorMessage} from '../util';
import {isEmpty} from 'lodash';
import ScreenContainer from '../components/ScreenContainer';
import {useAuthContext} from '../context/Auth.context';

const initialState = {
  phone: '9885098850',
  password: '9885098850',
};

GoogleSignin.configure({
  androidClientId: getConfig().ANDROID_GOOGLE_SIGN_IN_KEY, // client ID of type WEB for your server (needed to verify user ID and offline access)
  iosClientId: getConfig().IOS_GOOGLE_SIGN_IN_KEY,
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const LoginPage = () => {
  const {signIn} = useAuthContext();
  const [login, {data: logindata, error: loginError, isLoginLoading}] =
    useLoginMutation();
  const [
    userCheck,
    {data: userCheckData, error: userCheckError, isUserCheckLoading},
  ] = useUserCheckMutation();

  const dispatch = useDispatch();
  const [state, setState] = useSetState(initialState);
  const onSubmit = e => {
    login(state);
  };
  const handleLogin = data => {
    const token = data.token;
    const username = 'title';
    signIn(username, token);
  };

  useEffect(() => {
    if (loginError) {
      showErrorMessage(loginError?.error);
    } else if (!isEmpty(logindata)) {
      handleLogin(logindata);
      dispatch(updateLoginToken(logindata));
    }
  }, [loginError, logindata]);

  useEffect(() => {
    if (userCheckData?.user) {
      handleLogin(userCheckData);
      dispatch(updateUserCheck(userCheckData));
    }
  }, [userCheckData]);

  const GoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const googleUserInfo = await GoogleSignin.signIn();
      const {email} = googleUserInfo.user;
      dispatch(updateGoogleUserInfo(googleUserInfo));
      userCheck(email);
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

  const registerAsDriver = () => {
    Linking.openURL('https://www.apnicabi.com/register').catch(err =>
      console.error('An error occurred', err),
    );
  };

  return (
    <ScrollView>
      <View style={LoginStyles.container}>
        <ImageBackground
          source={require('../assets/images/bg.jpeg')}
          resizeMode="cover"
          style={LoginStyles.image}>
          <View style={LoginStyles.logoSection}>
            <Text style={LoginStyles.logoTxt}>{'Apni Cabi'.toUpperCase()}</Text>
          </View>
        </ImageBackground>
        <ScreenContainer>
          <View style={LoginStyles.section}>
            <View>
              <TextInput
                placeholder="Phone Number"
                onChangeText={newText => setState({phone: newText})}
                value={state.phone}
                style={LoginStyles.textInputPickup}
              />
              <TextInput
                placeholder="Password"
                onChangeText={newText => setState({password: newText})}
                value={state.password}
                style={LoginStyles.textInputDrop}
                secureTextEntry={true}
              />
              {isLoginLoading && <Text>Please wait...</Text>}
              <View>
                <Pressable
                  style={LoginStyles.button}
                  android_ripple={{color: '#fff'}}
                  onPress={() => onSubmit()}>
                  <Text style={LoginStyles.text}>{'Login'.toUpperCase()}</Text>
                </Pressable>
              </View>
              {/* <View style={LoginStyles.signUpContainer}>
              <View style={LoginStyles.forgotSection}>
                <Text style={LoginStyles.headerText}>Forgot</Text>
                <Text style={LoginStyles.greenTxt}>Password?</Text>
              </View>
            </View> */}
            </View>
            <View>
              <Text style={[LoginStyles.headerText, CommonStyles.mtb10]}>
                {'or'}
              </Text>
              <GoogleSigninButton
                style={{width: '100%', height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={GoogleSignIn}
              />
            </View>
            <View style={[CommonStyles.mtb10, {marginTop: 50}]}>
              <Text style={[LoginStyles.headerText, CommonStyles.mtb10]}>
                {"Don't have an account?"}
              </Text>
              <Pressable
                onPress={registerAsDriver}
                style={[
                  LoginStyles.googleBtn,
                  CommonStyles.mb10,
                  {backgroundColor: COLORS.brand_blue},
                ]}
                android_ripple={{color: '#ccc'}}>
                <Text style={LoginStyles.googleTxt}>
                  {'Register as a Driver'}
                </Text>
              </Pressable>

              <Pressable
                onPress={GoogleSignIn}
                style={[LoginStyles.googleBtn, CommonStyles.mb10]}
                android_ripple={{color: '#ccc'}}>
                <Text style={[LoginStyles.googleTxt, {color: COLORS.black}]}>
                  {'Register as a User'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScreenContainer>
      </View>
    </ScrollView>
  );
};
export default LoginPage;
