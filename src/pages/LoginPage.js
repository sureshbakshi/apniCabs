import React, { useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Icon, ImageView, Text } from '../components/common';
import { COLORS, LOGIN_FORM, ROUTES_NAMES } from '../constants';
import { useDispatch } from 'react-redux';
import {
  updateGoogleUserInfo,
  updateUserCheck,
} from '../slices/authSlice';
import { useGetLoginOTPMutation, useLoginMutation, useUserCheckMutation, useVerifyOTPMutation } from '../slices/apiSlice';
import { isEmpty } from 'lodash';
import ScreenContainer from '../components/ScreenContainer';
import { useAuthContext } from '../context/Auth.context';
import Config from 'react-native-config';
import { navigate } from '../util/navigationService';
import { disconnectSocket } from '../sockets/socketConfig';
import images from '../util/images';
import { openOwnerPortal } from '../util/config';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from '../schema';
import CustomButton from '../components/common/CustomButton';
import OTPForm from '../components/OTPForm';
import HeaderImage from '../components/common/HeaderImage';

// const initialState = {
//   email: 'sureshbakshi88@gmail.com',
//   password: 'abc123',
// };

const initialState = {
  mobile: '',
  // password: ''
}

GoogleSignin.configure({
  androidClientId: Config.ANDROID_GOOGLE_SIGN_IN_KEY, // client ID of type WEB for your server (needed to verify user ID and offline access)
  iosClientId: Config.IOS_GOOGLE_SIGN_IN_KEY,
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const LoginPage = () => {
  const [login, { data: logindata, error: loginError, isLoginLoading }] =
    useLoginMutation();
  const [userCheck, { data: userCheckData, error: userCheckError }] =
    useUserCheckMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(logindata)) {
      dispatch(updateUserCheck(logindata));
    }
  }, [logindata]);

  useEffect(() => {
    disconnectSocket()
  }, [])

  // useEffect(() => {
  //   console.log('userCheckData', userCheckData);
  //   if (userCheckData?.token) {
  //     handleLogin(userCheckData);
  //     dispatch(updateUserCheck(userCheckData));
  //   } else if (userCheckError) {
  //     navigate(ROUTES_NAMES.signUp);
  //   }
  // }, [userCheckData, userCheckError]);

  const GoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const googleUserInfo = await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens()
      const { email } = googleUserInfo.user;
      dispatch(updateGoogleUserInfo({ accessToken, ...googleUserInfo }));
      userCheck(email)
        .unwrap()
        .then(data => {
          dispatch(updateUserCheck(data));
        })
        .catch(error => navigate(ROUTES_NAMES.signUp));
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

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    ...methods
  } = useForm({
    mode: "onSubmit",
    defaultValues: initialState,
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = (data) => {
    console.log('data', data)
    const { email, password } = data;

    let payload = {
      email,
      password
    };
    login(payload);
  };
  const successHandler = (logindata) => {
    console.log('otp info', logindata)
    if (!isEmpty(logindata)) {
      dispatch(updateUserCheck(logindata));
    }
  }

  return (
    <View style={LoginStyles.container}>
      <HeaderImage/>

      <ScreenContainer>
        <View style={LoginStyles.section}>
          {/* <View>
              <FormProvider {...methods}>
                {LOGIN_FORM.map((field, index) => {
                  return (
                    <View key={field.name}>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                          return (
                            <>
                              <TextInput
                                name={field.name}
                                onBlur={onBlur}
                                onChangeText={(value) => {
                                  onChange(value);
                                }}
                                value={value.toString()}
                                placeholderTextColor={COLORS.gray}
                                style={[LoginStyles.textInputPickup]}
                                {...field.props}
                              />
                            </>
                          )
                        }}
                        name={field.name}
                        rules={{ required: `${field.label} is required` }}
                      />
                      {errors[field.name] && <Text style={CommonStyles.errorTxt}>{errors[field.name].message}</Text>}

                    </View>
                  );
                })}

                {isLoginLoading && <Text>Please wait...</Text>}
                <View>
                  <CustomButton
                    onClick={handleSubmit(onSubmit)}
                    label='Login'
                  />
                </View>
              </FormProvider>
              <Pressable style={[LoginStyles.forgotSection, {paddingVertical: 15, justifyContent: 'flex-end'}]} onPress={() => navigate(ROUTES_NAMES.forgotPassword)}>
                <Text style={[{color: COLORS.primary,textAlign: 'right' }]}>Forgot Password?</Text>
              </Pressable>
            </View> */}
          <OTPForm
            successHandler={successHandler}
            formFields={LOGIN_FORM}
            formSchema={signInSchema}
            formMutation={useGetLoginOTPMutation}
            initialState={initialState}
            getOTPPayloadKeys={['mobile']}
            verifyOTPMutation={useVerifyOTPMutation}
            formPayloadKeys={['mobile']}
            submitBtnLabel={'Get OTP'}
            heading={'Sign In'}
          />
          <View>
            {/* <Text style={[LoginStyles.headerText]}>
                {'or'}
              </Text> */}
            {/* <GoogleSigninButton
                style={{ width: '100%', height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={GoogleSignIn}
              /> */}

              <View style={[LoginStyles.signUpSection,{ marginTop: 20}]}>
                <Text style={[LoginStyles.headerText, { color: COLORS.text_light_gray, fontWeight: 'bold'}]}>Don’t have an account?</Text>
                <Pressable
                  android_ripple={{ color: '#fff' }}
                  onPress={GoogleSignIn}>
                  <Text style={{ color: COLORS.primary_blue, fontWeight: 'bold' }}> Sign Up</Text>
                </Pressable>
              </View>
            {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Pressable
                  onPress={GoogleSignIn}
                  style={[LoginStyles.googleBtn, {flex: 1, marginRight: 15}]}
                  android_ripple={{ color: '#ccc' }}>
                  <View style={{  flexDirection: 'row',justifyContent: 'center', alignItems: 'center' }}>
                    <ImageView
                      source={images.user}
                      style={{ minHeight: 5, minWidth: 5, height: 30, width: 30, marginRight: 10 }}
                    />
                    <Text style={[LoginStyles.googleTxt]}>
                      User
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={openOwnerPortal}
                  style={[LoginStyles.googleBtn, {flex: 1}]}
                  android_ripple={{ color: '#ccc' }}>
                  <View style={{  flexDirection: 'row',justifyContent: 'center', alignItems: 'center' }}>
                    <ImageView
                      source={images.taxiDriver}
                      style={{ minHeight: 5, minWidth: 5, height: 30, width: 30, marginRight: 10 }}
                    />
                    <Text style={[LoginStyles.googleTxt]}>
                      Driver
                    </Text>
                  </View>
                </Pressable>
              </View> */}
          </View>
          {/* <View style={[CommonStyles.mtb10, { marginTop: 50 }]}>
              <Text style={[LoginStyles.headerText, CommonStyles.mtb10]}>
                {"Don't have an account?"}
              </Text>
              <Pressable
                onPress={openOwnerPortal}
                style={[
                  LoginStyles.googleBtn,
                  CommonStyles.mb10,
                  { backgroundColor: COLORS.brand_yellow },
                ]}
                android_ripple={{ color: '#ccc' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
                  <ImageView
                    source={images.captain}
                    style={{ minHeight: 5, minWidth: 5, height: 30, width: 30, marginRight: 10 }}
                  />
                  <Text style={LoginStyles.googleTxt}>
                    {'Register as a Driver'}
                  </Text>
                </View>
              </Pressable>


            </View> */}
        </View>
      </ScreenContainer>
    </View>
  );
};
export default LoginPage;
