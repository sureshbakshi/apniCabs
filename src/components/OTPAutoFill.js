import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import OtpAutoFillViewManager from 'react-native-otp-auto-fill';
import { useDispatch, useSelector } from 'react-redux';
import { setAndroidDeviceCode } from '../slices/authSlice';
import { Text } from './common';
import useKeyboardDismiss from '../hooks/useKeyboardDismiss';

const OTPAutoFill = ({ route, data, callbackFunctions, scrollRef }) => {
    const otpInfo = route?.params?.data || data

    const dispatch = useDispatch()
    const [submitOTPHandler, { data: OTPResponse, error: getOTPError, isLoginLoading }] =
        callbackFunctions.verifyOTPMutation();
    const { androidDeviceCode } = useSelector(state => state.auth)
    const { dismiss, HiddenInput } = useKeyboardDismiss();

    const handleComplete = ({
        nativeEvent: { code },
    }) => {
        // dismiss keyboard using reusable hook
        dismiss();
        submitOTPHandler({ ...otpInfo, otp: code, }).unwrap()
            .then(data => {
                if (data) {
                    callbackFunctions?.successHandler?.(data)
                }
            })
            .catch(error => {
                // console.log('error', error)
                //  showErrorMessage(error || 'Something went wrong. Please retry.')
                // callbackFunctions?.errorHandler?.(error)
            });
    };


    // This is only needed once to get the Android Signature key for SMS body
    const handleOnAndroidSignature = ({
        nativeEvent: { code },
    }) => {
        dispatch(setAndroidDeviceCode(code))
        // callbackFunctions?.getOTP?.(code)
    };
    return (
        <>
            <Text style={{ marginBottom: 8, fontSize: 16 }}>Enter OTP</Text>
            <View style={[styles.textInputPickup]}>
                {/* hidden input used only to force blur/fallback keyboard dismissal */}
                <OtpAutoFillViewManager
                    onComplete={handleComplete}
                    onAndroidSignature={androidDeviceCode ? () => { } : handleOnAndroidSignature}
                    style={{
                        fontSize: 40,
                        height: 55,
                    }}
                    length={4} // Define the length od OTP. This is a must
                    space={1}
                />

            </View>
            <HiddenInput />
        </>
    );
}

export default React.memo(OTPAutoFill);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputPickup: {
        borderColor: '#CCCCCC',
        borderRadius: 8,
        borderWidth: 0.5,
        paddingHorizontal: 15,
    }
});