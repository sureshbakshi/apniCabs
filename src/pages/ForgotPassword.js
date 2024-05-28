import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    ScrollView,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import { Text } from '../components/common';
import { COLORS, FORGOT_PASSWORD, ROUTES_NAMES } from '../constants';
import { useSelector } from 'react-redux';
import { useForgotPasswordMutation } from '../slices/apiSlice';
import { isEmpty } from 'lodash';
import ScreenContainer from '../components/ScreenContainer';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from '../schema';
import CustomButton from '../components/common/CustomButton';
import OTPAutoFill from '../components/OTPAutoFill';
import { navigate } from '../util/navigationService';
import { showErrorMessage, showSuccessMessage } from '../util';

const initialState = {
    mobile: '',
    password: '',
    confirm_password: ''
}
export default () => {
    const [submitForgotHandler, { data: forgotResponse, error: getOTPError, isLoginLoading }] =
        useForgotPasswordMutation();
    const { androidDeviceCode } = useSelector(state => state.auth)
    const [otpInfo, setOTPInfo] = useState(null)
    const [payload, setPayload] = useState(null)


    const handleResponse = res => {
        if (res.code) {
            setOTPInfo(res)
        }
    };

    useEffect(() => {
        if (!isEmpty(forgotResponse)) {
            handleResponse(forgotResponse);
        }
    }, [forgotResponse]);

    const {
        watch,
        handleSubmit,
        control,
        formState: { errors, isDirty },
        ...methods
    } = useForm({
        mode: "onSubmit",
        defaultValues: initialState,
        resolver: yupResolver(forgotPasswordSchema),
    });

    const onSubmit = (formData) => {
        const { confirm_password, ...otpPayload } = formData
        if (androidDeviceCode) {
            submitForgotHandler({ mobile: otpPayload.mobile }); //add device code
        }
        setPayload(otpPayload);
    };

    const getOTP = (deviceCode) => {
        submitForgotHandler({ mobile: payload?.mobile });//add device code
    }

    const successHandler = () =>{
        showSuccessMessage('Login with new password')
        navigate(ROUTES_NAMES.signIn)

    }

    const errorHandler = () =>{
        setOTPInfo(null)
        setPayload(null)
        showErrorMessage('OTP not sent. Please retry.')
    }

    const isError = Object.entries(errors).length > 0
    const callbackFunctions = {
        getOTP: getOTP,
        successHandler: successHandler,
        errorHandler: errorHandler
    }
    return (
        <View style={[LoginStyles.container, { paddingTop: 50 }]}>
            <ScrollView>
                <ScreenContainer>
                    <View style={LoginStyles.section}>
                        <View>
                            <FormProvider {...methods}>
                                {FORGOT_PASSWORD.map((field, index) => {
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
                                                                disable={otpInfo}
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
                                {<CustomButton
                                    onClick={handleSubmit(onSubmit)}
                                    label={'Get OTP'}
                                    disabled={Boolean(isError || otpInfo)}
                                />}
                            </FormProvider>
                            {
                                (payload && !getOTPError) && <OTPAutoFill data={{ code: otpInfo?.code, otp: otpInfo?.otp, ...payload }} callbackFunctions={callbackFunctions} />
                            }
                        </View>
                    </View>
                </ScreenContainer>
            </ScrollView>
        </View>
    );
};
