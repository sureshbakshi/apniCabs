import * as React from 'react';
import { StyleSheet, SafeAreaView, Keyboard, View } from 'react-native';
import OtpAutoFillViewManager from 'react-native-otp-auto-fill';
import { COLORS } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setAndroidDeviceCode } from '../slices/authSlice';
import { Text } from './common';
import LoginStyles from '../styles/LoginPageStyles';

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
                if (data) {
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
        <SafeAreaView style={[styles.container]}>
            <Text style={{ marginBottom: 8, fontSize: 16 }}>Enter OTP</Text>
            <View style={[LoginStyles.textInputPickup, {paddingTop: 10, paddingBottom:0}]}>
                <OtpAutoFillViewManager
                    onComplete={handleComplete}
                    onAndroidSignature={androidDeviceCode ? () => { } : handleOnAndroidSignature}
                    style={styles.textInputPickup}
                    length={4} // Define the length od OTP. This is a must
                    space={2}
                />
            </View>
            {/* <CustomButton label={'Submit OTP'} onClick={handleComplete} /> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputPickup: {
        paddingHorizontal: 15,
        minHeight: 36,
        fontSize: 16,
      }
});