import React from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import { FORGOT_PASSWORD, ROUTES_NAMES } from '../constants';
import { useForgotPasswordMutation, useVerifyOTPMutation } from '../slices/apiSlice';
import ScreenContainer from '../components/ScreenContainer';
import { forgotPasswordSchema } from '../schema';
import { navigate } from '../util/navigationService';
import { showSuccessMessage } from '../util';
import OTPForm from '../components/OTPForm';

const initialState = {
    mobile: '7989378135',
    password: 'abc@123',
    confirm_password: 'abc@123'
}
export default () => {

    const successHandler = () => {
        showSuccessMessage('Login with new password')
        navigate(ROUTES_NAMES.signIn)

    }

    return (
        <View style={[LoginStyles.container, { paddingTop: 50 }]}>
                <ScreenContainer>
                    <View style={LoginStyles.section}>
                        <OTPForm successHandler={successHandler} formFields={FORGOT_PASSWORD} formSchema={forgotPasswordSchema} formMutation={useForgotPasswordMutation} initialState={initialState} getOTPPayloadKeys={['mobile']} verifyOTPMutation={useVerifyOTPMutation}/>
                    </View>
                </ScreenContainer>
        </View>
    );
};
