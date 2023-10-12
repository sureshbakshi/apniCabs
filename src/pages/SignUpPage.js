import React, {useEffect} from 'react';
import {View, TextInput, Pressable, ImageBackground} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import ScreenContainer from '../components/ScreenContainer';
import {navigate} from '../util/navigationService';
import {Text} from '../components/common';
import {useSelector, useDispatch} from 'react-redux';
import {useSingUpMutation} from '../slices/apiSlice';
import {updateGoogleUserInfo} from '../slices/authSlice';
import {useSetState} from 'react-use';

const initialState = {
  email: '',
  password: '',
  phone_number: '',
  name: '',
};
const SignUpPage = () => {
  const dispatch = useDispatch();
  const [singUp, {data: signUpdata, error: singUpError, isLoading}] =
    useSingUpMutation();
  const googleInfo = useSelector(state => state.auth.googleInfo);
  const [state, setState] = useSetState(initialState);

  useEffect(() => {
    if (googleInfo) {
      setState({
        email:googleInfo?.email,
        name:googleInfo?.name
      });
    }
  }, [googleInfo]);

  const handleSignUp = () => {
    singUp(state);
    dispatch(updateGoogleUserInfo(state));
  };

  return (
    <ScreenContainer>
      <View style={LoginStyles.container}>
        <ImageBackground
          source={require('../assets/images/bg.jpeg')}
          resizeMode="cover"
          style={LoginStyles.image}>
          <View style={LoginStyles.logoSection}>
            <Text style={LoginStyles.logoTxt}>{'Apni Cabi'.toUpperCase()}</Text>
          </View>
        </ImageBackground>

        <View style={[LoginStyles.section]}>
          <View>
            <TextInput
              placeholder="Name"
              onChangeText={newText => setState({name: newText})}
              value={state.name}
              style={LoginStyles.textInputPickup}
            />
            <TextInput
              placeholder="Email Address"
              onChangeText={newText => setState({email: newText})}
              value={state.email}
              style={LoginStyles.textInputPickup}
            />
            <TextInput
              placeholder="Phone Number"
              onChangeText={newText => setState({phone_number: newText})}
              value={state.phone_number}
              style={LoginStyles.textInputPickup}
            />
            <TextInput
              placeholder="Create Password"
              onChangeText={newText => setState({password: newText})}
              value={state.password}
              style={LoginStyles.textInputDrop}
            />
          </View>
          <View>
            <View style={CommonStyles.mb10}>
              <Pressable
                style={LoginStyles.button}
                android_ripple={{color: '#fff'}}
                onPress={handleSignUp}>
                <Text style={LoginStyles.text}>
                  {'Sign Up Now'.toUpperCase()}
                </Text>
              </Pressable>
            </View>
            <View style={LoginStyles.signUpSection}>
              <Text style={LoginStyles.headerText}>Already Registered?</Text>
              <Pressable
                android_ripple={{color: '#fff'}}
                onPress={() => navigate('SignIn')}>
                <Text style={LoginStyles.greenTxt}>Sign in</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};
export default SignUpPage;
