import * as React from 'react';
import { StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import OtpAutoFillViewManager from 'react-native-otp-auto-fill';
import { COLORS } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setAndroidDeviceCode } from '../slices/authSlice';
import { Text } from './common';

export default ({ route, data, callbackFunctions }) => {
    const otpInfo = route?.params?.data || data
    const dispatch = useDispatch()
    const [submitOTPHandler, { data: OTPResponse, error: getOTPError, isLoginLoading }] =
        callbackFunctions.verifyOTPMutation();
    const { androidDeviceCode } = useSelector(state => state.auth)

    const handleComplete = ({
        nativeEvent: { code },
    }) => {
        Keyboard?.dismiss()
        submitOTPHandler({ ...otpInfo, otp: code }).unwrap()
            .then(data => {
                if(data){
                    callbackFunctions?.successHandler?.(data)
                }
            })
            .catch(error => callbackFunctions?.errorHandler?.(error));
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