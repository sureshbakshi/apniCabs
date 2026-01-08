import React, { useEffect } from 'react';
import {
  View,
  Pressable,
  StatusBar,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import { Text } from '../components/common';
import { COLORS, LOGIN_FORM, ROUTES_NAMES, USER_ROLES } from '../constants';
import { useDispatch } from 'react-redux';
import {
  updateUserCheck,
} from '../slices/authSlice';
import { useGetLoginOTPMutation, useLoginMutation, useUserCheckMutation, useVerifyOTPMutation } from '../slices/apiSlice';
import isEmpty from 'lodash/isEmpty';
import ScreenContainer from '../components/ScreenContainer';
import { navigate } from '../util/navigationService';
import config from '../util/config';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from '../schema';
import OTPForm from '../components/OTPForm';
import HeaderImage from '../components/common/HeaderImage';
import { useTranslation } from 'react-i18next';

const initialState = {
  mobile: '',
}


const LoginPage = () => {
  const { t } = useTranslation();
  const [login, { data: logindata, error: loginError, isLoginLoading }] =
    useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(logindata)) {
      dispatch(updateUserCheck(logindata));
    }
  }, [logindata]);


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

  const additionalOTPPayload = {
    isDriver: config.ROLE === USER_ROLES.DRIVER
  }

  return (
    <View style={LoginStyles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <HeaderImage />

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
            additionalOTPPayload={additionalOTPPayload}
            additionalVerifyOTPPayload={additionalOTPPayload}
            getOTPPayloadKeys={['phone']}
            verifyOTPMutation={useVerifyOTPMutation}
            formPayloadKeys={['phone']}
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

            <View style={[LoginStyles.signUpSection, { marginTop: 20 }]}>
              <Text style={[LoginStyles.headerText, { color: COLORS.text_light_gray, fontWeight: 'bold' }]}>{t('no_account')}</Text>
              <Pressable
                android_ripple={{ color: '#fff' }}
                onPress={() => navigate(ROUTES_NAMES.signUp)}>
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
