import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Keyboard,
    Platform,
    Linking,
    Animated,
    Dimensions,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import { Text } from '../components/common';
import { COLORS, ELEMENTS, GENDER_TYPES, SELECT_OPTIONS_KEYS, USER_ROLES } from '../constants';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from '../components/common/CustomButton';
import OTPAutoFill from '../components/OTPAutoFill';
import { extractKeys, showErrorMessage } from '../util';
import config from '../util/config';
import Dropdown from './common/Dropdown';
import { useLazyGetCitiesQuery } from '../slices/apiSlice';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import useSlidingPanels from '../hooks/useSlidingPanels';


// const cities = [{ "id": "c3ca6e35-8eac-4806-a59b-8d0c9d832946", "code": "HYD", "name": "Hyderabad", "is_active": 1, "created_by": null, "created_at": "2025-01-20T08:46:14.000Z", "updated_by": null, "updated_at": null, "deleted_by": null, "deleted_at": null }, { "id": "f79b2eb5-ed50-4b20-87ab-c7b5612aff68", "code": "BZA", "name": "Vijayawada", "is_active": 1, "created_by": null, "created_at": "2025-01-20T08:46:14.000Z", "updated_by": null, "updated_at": null, "deleted_by": null, "deleted_at": null }]

export default ({ heading, successHandler, formFields, formSchema, formMutation, getOTPPayloadKeys = [], initialState, submitBtnLabel, additionalOTPPayload = {}, verifyOTPMutation, formPayloadKeys, additionalVerifyOTPPayload = {}, scrollRef }) => {
    const { t } = useTranslation();
    const [submitHandler, { data: OTPResponse, error: getOTPError, isLoginLoading }] =
        formMutation();
    const [triggerGetCities, { data: cities, error: citiesError, isFetching: citiesFetching, isLoading: citiesLoading }] = useLazyGetCitiesQuery();

    useEffect(() => {
        const handle = requestIdleCallback(() => {
            try {
                triggerGetCities({}, { refetchOnMountOrArgChange: true });
            } catch (e) {
                console.log('triggerGetCities error', e);
            }
        });
        return () => cancelIdleCallback(handle);
    }, [triggerGetCities]);

    const [otpInfo, setOTPInfo] = useState(null)
    const [payload, setPayload] = useState(null)
    const [otpKey, setOtpKey] = useState(0);
    const route = useRoute();

    // Clear OTP info and payload whenever the navigation route changes
    useEffect(() => {
        setOTPInfo(null);
        setPayload(null);
        // force remount OTP input when route changes
        setOtpKey(k => k + 1);
    }, [route?.key, route?.params]);

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
        const OTPPayload = extractKeys(formData, getOTPPayloadKeys);
        console.log('OTPPayload', OTPPayload)
        submitHandler({ ...OTPPayload, ...(additionalOTPPayload && additionalOTPPayload) }); //add device code
        const formPayload = extractKeys(formData, formPayloadKeys)
        setPayload(formPayload);
        Keyboard?.dismiss()
    };

    const getOTP = (deviceCode) => {
        const OTPPayload = extractKeys(payload, getOTPPayloadKeys)

        submitHandler({ ...OTPPayload, ...(additionalOTPPayload && additionalOTPPayload) });//add device code
    }

    const errorHandler = ({ data }) => {
        console.log('error+++++++', data)
        setOTPInfo(null)
        setPayload(null)
        // ensure OTP input is cleared
        setOtpKey(k => k + 1);
        showErrorMessage(data?.error || 'Something went wrong. Please retry.')
    }

    // allow user to go back and edit details (clear OTP state)
    const handleEditDetails = () => {
        setOTPInfo(null);
        setPayload(null);
        // remount otp input so its internal value is reset
        setOtpKey(k => k + 1);
    }

    const isError = Object.entries(errors).length > 0
    const callbackFunctions = {
        getOTP: getOTP,
        successHandler: successHandler,
        errorHandler: errorHandler,
        verifyOTPMutation: verifyOTPMutation
    }
    const cityTypesFormat = cities
        ?.filter((item) => item.is_active === 1)  // Filter cities where is_active is 1
        .map((item) => ({
            ...item,            // Keep all original properties
            value: item.id,     // Add value as item.id
            label: item.name    // Add label as item.name
        }));
    const options = {
        [SELECT_OPTIONS_KEYS.city]: cityTypesFormat,
        [SELECT_OPTIONS_KEYS.gender]: GENDER_TYPES
    }

    const screenWidth = Dimensions.get('window').width;

    // sliding panels hook (encapsulates animation logic)
    const { formTranslate, otpTranslate, animateTo, setPositions } = useSlidingPanels(screenWidth);

    // container measurements so animations use actual container width/height
    const [containerWidth, setContainerWidth] = React.useState(screenWidth);
    const [containerHeight, setContainerHeight] = React.useState(undefined);

    // measured heights for each panel so we can size the container to visible content
    const [formHeight, setFormHeight] = React.useState(undefined);
    const [otpHeight, setOtpHeight] = React.useState(undefined);

    // derived flag used to show OTP panel
    const showOTP = Boolean(payload && OTPResponse && !getOTPError);

    // initialize positions when container width changes (do NOT run on showOTP changes)
    // otherwise positions are set instantly and animations are cancelled
    React.useEffect(() => {
        if (containerWidth) setPositions(Boolean(payload && OTPResponse && !getOTPError), containerWidth);
    }, [containerWidth, setPositions, /* intentionally exclude showOTP to allow animateTo to run */]);

    // when measured panel heights change or showOTP toggles, set the container height
    React.useEffect(() => {
        if (showOTP) {
            if (otpHeight) setContainerHeight(otpHeight);
        } else {
            if (formHeight) setContainerHeight(formHeight);
        }
    }, [showOTP, formHeight, otpHeight]);

    // animate panels when showOTP changes
    React.useEffect(() => {
        animateTo(showOTP, containerWidth);
    }, [showOTP, containerWidth, animateTo]);
    return (
        <View>
            <Text style={LoginStyles.logoHeardertext}>{heading} as {config.ROLE === USER_ROLES.DRIVER ? "Driver" : 'User'} </Text>

            <FormProvider {...methods}>
                <View
                    style={{ width: '100%', overflow: 'hidden', height: containerHeight || undefined, position: 'relative' }}
                    onLayout={(e) => {
                        const { width } = e.nativeEvent.layout;
                        // initialize container width if it changed
                        if (width && width !== containerWidth) setContainerWidth(width);
                    }}
                >
                    {/* Form panel */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            transform: [{ translateX: formTranslate }],
                        }}
                        onLayout={(e) => {
                            const { height } = e.nativeEvent.layout;
                            // always record the form content height
                            if (height && height !== formHeight) setFormHeight(height);
                        }}
                        pointerEvents={showOTP ? 'none' : 'auto'}
                    >
                        <>
                            {formFields.map((field, index) => {
                                return (
                                    <View key={field.name} style={{ marginBottom: 10 }}>
                                        <Controller
                                            control={control}
                                            render={({ field: { onChange, onBlur, value } }) => {
                                                return (
                                                    <>
                                                        {field.element === ELEMENTS.checkbox ? (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                                                <Checkbox
                                                                    status={value ? 'checked' : 'unchecked'}
                                                                    onPress={() => onChange(!value)}
                                                                    color={COLORS.primary}
                                                                    {...field.props}
                                                                />
                                                                <Text
                                                                    onPress={() => {
                                                                        if (field?.url) Linking.openURL(field.url);
                                                                        onChange?.(!value)
                                                                    }}
                                                                    style={{ marginLeft: 8, color: field?.url ? COLORS.brand_blue : COLORS.black }}
                                                                >
                                                                    {field.label}
                                                                </Text>
                                                            </View>
                                                        ) : (
                                                            <>
                                                                <Text style={{ marginBottom: 8, fontSize: 16, fontFamily: 'Poppins' }}>{field.label || field.props?.placeholder}</Text>
                                                                {field.element === ELEMENTS.select ?
                                                                    <Dropdown
                                                                        label={field.label}
                                                                        name={field.name}
                                                                        options={options[field.fieldKey]}
                                                                        {...field.props}
                                                                        onChange={onChange}
                                                                    /> :
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
                                                                        label={field.label}
                                                                        {...field.props}
                                                                    />}
                                                            </>)
                                                        }
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
                            {(citiesLoading || citiesFetching) && <Text>Fetching cities...</Text>}
                            <CustomButton
                                onClick={handleSubmit(onSubmit)}
                                label={submitBtnLabel || t('submit_btn')}
                                disabled={Boolean(isLoginLoading || isError || otpInfo)}
                                iconRight={{ name: 'arrow-right', size: 'large' }}
                                isLowerCase
                            />

                        </>
                    </Animated.View>

                    {/* OTP panel */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            transform: [{ translateX: otpTranslate }],
                        }}
                        onLayout={(e) => {
                            const { height } = e.nativeEvent.layout;
                            // always record the otp content height
                            if (height && height !== otpHeight) setOtpHeight(height);
                        }}
                        pointerEvents={showOTP ? 'auto' : 'none'}
                    >

                        <View style={{ marginBottom: 10 }}>
                            {<OTPAutoFill
                                key={otpKey}
                                data={{ code: otpInfo?.code, ...(payload && payload), ...additionalVerifyOTPPayload }}
                                callbackFunctions={callbackFunctions}
                            />}
                            <Text
                                onPress={handleEditDetails}
                                style={{ marginTop: 8, color: COLORS.primary_blue, textDecorationLine: 'underline', textAlign: 'center' }}
                            >
                                Go back
                            </Text>
                        </View>
                    </Animated.View>
                </View>
            </FormProvider>
        </View>
    );
};
