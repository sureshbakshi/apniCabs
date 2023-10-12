import React, {useContext, useEffect} from 'react';
import {
  View,
  TextInput,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native';

import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import {useSetState} from 'react-use';
import {navigate} from '../util/navigationService';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Text} from '../components/common';
import {COLORS, ROUTES_NAMES} from '../constants';
import {useDispatch} from 'react-redux';
import {updateGoogleUserInfo, updateUserCheck} from '../slices/authSlice';
import {useLoginMutation, useUserCheckMutation} from '../slices/apiSlice';
import { getConfig } from '../util';
const initialState = {
  email: '',
  password: '',
};

GoogleSignin.configure({
  androidClientId:getConfig().ANDROID_GOOGLE_SIGN_IN_KEY, // client ID of type WEB for your server (needed to verify user ID and offline access)
  iosClientId:getConfig().IOS_GOOGLE_SIGN_IN_KEY,
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const LoginPage = () => {
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
    dispatch(updateGoogleUserInfo(state));
    setState({
      email: '',
      password: '',
    });
  };
  useEffect(() => {
    console.log('logindata', logindata);
    console.log('loginError', loginError);
  }, [loginError, logindata]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const googleUserInfo = await GoogleSignin.signIn();
      const {email} = googleUserInfo.user;
      console.log('email', email);
      dispatch(updateGoogleUserInfo(googleUserInfo));

      userCheck(email);
      console.log('userCheckData',userCheckData)
      if (userCheckData.user) {
        dispatch(updateUserCheck(userCheckData));
      } else {
        navigate(ROUTES_NAMES.signUp);
      }

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
      <ScrollView>
        <View style={LoginStyles.section}>
          <View>
            <TextInput
              placeholder="Email"
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
            {isLoginLoading && <Text>Please wait...</Text>}
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
              {'or'}
            </Text>
            <GoogleSigninButton
              style={{width: '100%', height: 48}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
            />
          </View>
          <View style={CommonStyles.mtb10}>
            <Text style={[LoginStyles.headerText, CommonStyles.mtb10]}>
              {"Don't have a account"}
            </Text>
            <Pressable
              style={[
                LoginStyles.googleBtn,
                CommonStyles.mb10,
                {backgroundColor: COLORS.brand_blue},
              ]}
              android_ripple={{color: '#ccc'}}>
              <Text style={LoginStyles.googleTxt}>{'Sign in a Driver'}</Text>
            </Pressable>

            <Pressable
              onPress={signIn}
              style={[LoginStyles.googleBtn, CommonStyles.mb10]}
              android_ripple={{color: '#ccc'}}>
              <Text style={[LoginStyles.googleTxt, {color: COLORS.black}]}>
                {'Sign in a User'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginPage;
