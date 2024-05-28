import * as React from 'react';
import { Alert, StyleSheet, SafeAreaView } from 'react-native';
import OtpAutoFillViewManager from 'react-native-otp-auto-fill';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useVerifyOTPMutation } from '../slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setAndroidDeviceCode, updateUserCheck } from '../slices/authSlice';
import { Text } from './common';
import { navigate } from '../util/navigationService';

export default ({ route, data, callbackFunctions }) => {
    const otpInfo = route?.params?.data || data
    const dispatch = useDispatch()
    const [submitOTPHandler, { data: OTPResponse, error: getOTPError, isLoginLoading }] =
        useVerifyOTPMutation();
    const { androidDeviceCode } = useSelector(state => state.auth)


    const handleComplete = ({
        nativeEvent: { code },
    }) => {
        submitOTPHandler({ ...otpInfo, otp: code }).unwrap()
            .then(data => {
                if(data){
                    callbackFunctions?.successHandler?.()
                }
            })
            .catch(error => callbackFunctions?.errorHandler?.());
    };


    // This is only needed once to get the Android Signature key for SMS body
    const handleOnAndroidSignature = ({
        nativeEvent: { code },
    }) => {
        dispatch(setAndroidDeviceCode(code))
        callbackFunctions?.getOTP?.(code)
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{marginVertical: 10}}>Enter OTP</Text>
            <OtpAutoFillViewManager
                onComplete={handleComplete}
                onAndroidSignature={androidDeviceCode ? () => { } : handleOnAndroidSignature}
                style={styles.box}
                length={4} // Define the length od OTP. This is a must
                space={1}
            />
            {/* <CustomButton label={'Submit OTP'} onClick={handleComplete} /> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
    box: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.bg_gray_primary
    },
});