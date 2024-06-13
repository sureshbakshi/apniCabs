import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Keyboard,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import { Text } from '../components/common';
import { COLORS } from '../constants';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from '../components/common/CustomButton';
import OTPAutoFill from '../components/OTPAutoFill';
import { extractKeys, showErrorMessage } from '../util';

export default ({ successHandler, formFields, formSchema, formMutation, getOTPPayloadKeys=[], initialState, submitBtnLabel, additionalOTPPayload={}, verifyOTPMutation, formPayloadKeys, additionalVerifyOTPPayload = {} }) => {
    const [submitHandler, { data: OTPResponse, error: getOTPError, isLoginLoading }] =
        formMutation();
    const { androidDeviceCode } = useSelector(state => state.auth)
    const [otpInfo, setOTPInfo] = useState(null)
    const [payload, setPayload] = useState(null)


    const handleResponse = res => {
        if (res.code) {
            setOTPInfo(res)
        }
    };

    useEffect(() => {
        if (!isEmpty(OTPResponse)) {
            handleResponse(OTPResponse);
        }
    }, [OTPResponse]);

    const {
        watch,
        handleSubmit,
        control,
        formState: { errors, isDirty },
        ...methods
    } = useForm({
        mode: "onSubmit",
        defaultValues: initialState,
        resolver: yupResolver(formSchema),
    });

    const onSubmit = (formData) => {
        // const { confirm_password, ...otpPayload } = formData
        const OTPPayload = extractKeys(formData, getOTPPayloadKeys)
        if (androidDeviceCode) {
            submitHandler({ ...OTPPayload, ...(additionalOTPPayload && additionalOTPPayload) }); //add device code
        }
        const formPayload = extractKeys(formData, formPayloadKeys)
        setPayload(formPayload);
        Keyboard?.dismiss()
    };

    const getOTP = (deviceCode) => {
        const OTPPayload = extractKeys(payload, getOTPPayloadKeys)

        submitHandler({ ...OTPPayload, ...(additionalOTPPayload && additionalOTPPayload) });//add device code
    }

    const errorHandler = () => {
        setOTPInfo(null)
        setPayload(null)
        showErrorMessage('OTP not sent. Please retry.')
    }

    const isError = Object.entries(errors).length > 0
    const callbackFunctions = {
        getOTP: getOTP,
        successHandler: successHandler,
        errorHandler: errorHandler,
        verifyOTPMutation: verifyOTPMutation
    }
    return (

        <View>
            <FormProvider {...methods}>
                {formFields.map((field, index) => {
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
                                                value={value?.toString()}
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
                    label={submitBtnLabel || 'Submit'}
                    disabled={Boolean(isError || otpInfo)}
                />}
            </FormProvider>
            {
                (payload && !getOTPError) && <OTPAutoFill data={{ code: otpInfo?.code, otp: otpInfo?.otp, ...(payload && payload), ...additionalVerifyOTPPayload }} callbackFunctions={callbackFunctions} />
            }
        </View>
    );
};
