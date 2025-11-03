import React, { useRef } from 'react';
import {
  View,
  Pressable,
  StatusBar,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
import { useDispatch } from 'react-redux';
import { useGetSignupOTPMutation, useSignupMutation } from '../slices/apiSlice';
import { updateUserCheck } from '../slices/authSlice';
import { COLORS, ELEMENTS, ROUTES_NAMES, SELECT_OPTIONS_KEYS, SIGN_UP_FORM, USER_ROLES } from '../constants';
import { driverSignupSchema, signupSchema, signupUserSchema } from '../schema';
import OTPForm from '../components/OTPForm';
import HeaderImage from '../components/common/HeaderImage';
import config from '../util/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
const isDriver = config.ROLE === USER_ROLES.DRIVER
const DRIVER_ADD_FIELDS = [{
  name: "city",
  label: "City",
  element: ELEMENTS.select,
  fieldKey: SELECT_OPTIONS_KEYS.city,
  props: {
    placeholder: "Select City",
  }
}, {
  name: "gender",
  label: "Gender",
  element: ELEMENTS.select,
  fieldKey: SELECT_OPTIONS_KEYS.gender,
  props: {
    placeholder: "Select Gender",
  }
}]
const SIGN_UP_FORM_FIELDS = [
  ...SIGN_UP_FORM,
  ...(config.ROLE === 'DRIVER' ? DRIVER_ADD_FIELDS : [])
  ,
  {
    name: 'agreeTerms',
    label: 'I agree to the Terms and Conditions',
    element: ELEMENTS.checkbox,
    defaultValue: false,
    url: 'https://pikbike.com/terms_and_conditions.html',
  }
]
const SignUpPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const googleInfo = undefined
  const initialState = {
    name: googleInfo?.name || '',
    email: googleInfo?.email || '',
    agreeTerms: false,
    phone: '',
    referredBy: ''
  }
  const scrollRef = useRef(null);


  const successHandler = (signUpdata) => {
    if (signUpdata) {
      dispatch(updateUserCheck(signUpdata));
      // navigate(ROUTES_NAMES.signIn)
    }
  }
  const additionalVerifyOTPPayload = {
    avatar: googleInfo?.photo || '',
    // provider: Platform.OS || 'mobile',
    // isDriver: config.ROLE === USER_ROLES.DRIVER,
    user_type: config.ROLE === USER_ROLES.DRIVER ? 'driver' : 'user'
  }
  return (
    <View style={LoginStyles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <HeaderImage />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraHeight={30}
        ref={scrollRef}
      >
        {/* <ScreenContainer> */}
          <View style={[LoginStyles.section]}>
            <View>
              <View>
                {/* <RadioButton.Group onValueChange={newValue => setRole(newValue)} value={role}  >
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
                    <RadioButton value={USER_ROLES.OWNER} color={COLORS.primary} />
                    <Text style={{ color: COLORS.black, fontWeight: 'bold' }}>USER</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginLeft: 15 }}>
                    <RadioButton value={USER_ROLES.DRIVER} color={COLORS.primary} />
                    <Text style={{ color: COLORS.black, fontWeight: 'bold' }}>DRIVER</Text>
                  </View>
                </View>
              </RadioButton.Group> */}
                <OTPForm
                  successHandler={successHandler}
                  formFields={SIGN_UP_FORM_FIELDS}
                  formSchema={isDriver ? driverSignupSchema : signupUserSchema}
                  formMutation={useGetSignupOTPMutation}
                  initialState={initialState}
                  getOTPPayloadKeys={['phone']}
                  additionalOTPPayload={{ isDriver: config.ROLE === USER_ROLES.DRIVER }}
                  verifyOTPMutation={useSignupMutation}
                  additionalVerifyOTPPayload={additionalVerifyOTPPayload}
                  formPayloadKeys={['name', 'email', 'phone', 'referredBy', 'city', 'gender']}
                  submitBtnLabel={'Get OTP'}
                  heading={'Sign Up'}
                  scrollRef={scrollRef}
                />
                {/* <CustomButton
                  onClick={openOwnerPortal}
                  label={'Become a Driver'}
                  iconRight={{ name: 'arrow-top-right', size: 'large' }}
                  styles={{ backgroundColor: COLORS.button_blue_bg, marginTop: 10 }}
                  isLowerCase
                /> */}
              </View>
              <View style={[LoginStyles.signUpSection, { marginTop: 20 }]}>
                <Text style={[LoginStyles.headerText, { color: COLORS.text_light_gray, fontWeight: 'bold' }]}>{t('account')}</Text>
                <Pressable
                  android_ripple={{ color: '#fff' }}
                  onPress={() => navigate('SignIn')}>
                  <Text style={{ color: COLORS.primary_blue, fontWeight: 'bold' }}> Sign In</Text>
                </Pressable>
              </View>
            </View>
          </View>
        {/* </ScreenContainer> */}
      </KeyboardAwareScrollView>
    </View>
  );
};
export default SignUpPage;
