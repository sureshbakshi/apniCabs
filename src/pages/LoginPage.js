import React from 'react';
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
import { useGetLoginOTPMutation, useVerifyOTPMutation } from '../slices/apiSlice';
import isEmpty from 'lodash/isEmpty';
import ScreenContainer from '../components/ScreenContainer';
import { navigate } from '../util/navigationService';
import config from '../util/config';
import { signInSchema } from '../schema';
import OTPForm from '../components/OTPForm';
import HeaderImage from '../components/common/HeaderImage';
import { useTranslation } from 'react-i18next';

const initialState = {
  mobile: '',
}

const PHONE_KEYS = ['phone'];


const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const successHandler = React.useCallback((logindata) => {
    console.log('otp info', logindata)
    if (!isEmpty(logindata)) {
      dispatch(updateUserCheck(logindata));
    }
  }, [dispatch]);

  const additionalOTPPayload = React.useMemo(() => ({
    isDriver: config.ROLE === USER_ROLES.DRIVER
  }), []);

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
            getOTPPayloadKeys={PHONE_KEYS}
            verifyOTPMutation={useVerifyOTPMutation}
            formPayloadKeys={PHONE_KEYS}
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
