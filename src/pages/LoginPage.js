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
            <View style={[LoginStyles.signUpSection, { marginTop: 20 }]}>
              <Text style={[LoginStyles.headerText, { color: COLORS.text_light_gray, fontWeight: 'bold' }]}>{t('no_account')}</Text>
              <Pressable
                android_ripple={{ color: '#fff' }}
                onPress={() => navigate(ROUTES_NAMES.signUp)}>
                <Text style={{ color: COLORS.primary_blue, fontWeight: 'bold' }}> Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
};
export default LoginPage;
