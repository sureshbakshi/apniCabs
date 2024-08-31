import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import { RadioButton } from 'react-native-paper';
import ScreenContainer from '../components/ScreenContainer';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
import { useSelector, useDispatch } from 'react-redux';
import { useGetSignupOTPMutation, useSignupMutation } from '../slices/apiSlice';
import { updateUserCheck } from '../slices/authSlice';
import { COLORS, ROUTES_NAMES, SIGN_UP_FORM, USER_ROLES } from '../constants';
import images from '../util/images';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '../schema';
import { isEmpty } from 'lodash';
import OTPForm from '../components/OTPForm';
import { showSuccessMessage } from '../util';
import HeaderImage from '../components/common/HeaderImage';
import CustomButton from '../components/common/CustomButton';


const SignUpPage = () => {
  const dispatch = useDispatch();
  const { user: googleInfo, accessToken } = useSelector(state => state.auth.googleInfo);
  // const [role, setRole] = useState(USER_ROLES.OWNER)
  const initialState = {
    name: googleInfo?.name || '',
    email: googleInfo?.email || '',
    phone: '',
    referred_by: ''
  }

  const successHandler = (signUpdata) => {
    if (signUpdata) {
      dispatch(updateUserCheck(signUpdata));
      // navigate(ROUTES_NAMES.signIn)
    }
  }
  const additionalVerifyOTPPayload = {
    avatar: googleInfo?.photo || '',
    provider: Platform.OS || 'mobile',
    user_type: USER_ROLES.OWNER
  }
  return (
    <View style={LoginStyles.container}>
       <HeaderImage/>
      <ScrollView>

        <ScreenContainer>
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
                  formFields={SIGN_UP_FORM}
                  formSchema={signupSchema}
                  formMutation={useGetSignupOTPMutation}
                  initialState={initialState}
                  getOTPPayloadKeys={['phone', 'email']}
                  additionalOTPPayload={{ accessToken }}
                  verifyOTPMutation={useSignupMutation}
                  additionalVerifyOTPPayload={additionalVerifyOTPPayload}
                  formPayloadKeys={['name', 'email', 'phone', 'referred_by']}
                  submitBtnLabel={'Get OTP'}
                  heading={'Sign Up'}
                />
                <CustomButton
                    label={'Become a Driver'}
                    icon={{name: 'arrow-top-right', size: 'large'}}
                    styles={{backgroundColor:COLORS.button_blue_bg,marginTop:10}}
                    isLowerCase
                />
              </View>
              <View style={[LoginStyles.signUpSection,{ marginTop: 20}]}>
                <Text style={[LoginStyles.headerText, { color: COLORS.text_light_gray, fontWeight: 'bold'}]}>Already have an account?</Text>
                <Pressable
                  android_ripple={{ color: '#fff' }}
                  onPress={() => navigate('SignIn')}>
                  <Text style={{ color: COLORS.primary_blue, fontWeight: 'bold' }}> Sign In</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScreenContainer>
      </ScrollView>
    </View>
  );
};
export default SignUpPage;
