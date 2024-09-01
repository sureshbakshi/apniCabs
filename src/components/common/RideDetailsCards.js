import React, { useRef, useState } from 'react';
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import FindRideStyles from '../../styles/FindRidePageStyles';
import { ImageView, Text } from '../common';
import styles from '../../styles/MyRidePageStyles';
import images from '../../util/images';
import Timeline from '../common/timeline/Timeline';
import { COLORS, RideProxyNumber, RideStatus } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useCompleteRideRequestMutation, useRideRequestMutation } from '../../slices/apiSlice';
import { updateRideStatus, setActiveRide, clearDriverState } from '../../slices/driverSlice';
import { getScreen, showErrorMessage } from '../../util';
import useGetCurrentLocation from '../../hooks/useGetCurrentLocation';
import { setDialogStatus } from '../../slices/authSlice';
import CustomButton from './CustomButton';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import OpenMapButton from './OpenMapButton';
import CommonStyles from '../../styles/commonStyles';


const cancelRide = () => {
    const dispatch = useDispatch();
    return <View style={{ flexDirection: 'row', gap: 15, width: getScreen().screenWidth - 30, justifyContent: 'center', flex: 1 }}>
        <CustomButton
            onClick={() => RNImmediatePhoneCall.immediatePhoneCall(RideProxyNumber)}
            styles={
                { ...FindRideStyles.button, backgroundColor: COLORS.primary, minWidth: 160, height: 40 }
            }
            textStyles={{ color: COLORS.white, fontWeight: 400, fontSize: 14, lineHeight: 18 }}
            label={'Call up'}
            iconLeft={{ name: 'phone', size: 'medium' }}
            isLowerCase
        />
        <CustomButton
            onClick={() => dispatch(setDialogStatus(true))}
            styles={
                { ...FindRideStyles.button, backgroundColor: COLORS.card_bg, minWidth: 160, height: 40 }
            }
            textStyles={{ color: COLORS.black, fontWeight: 400, fontSize: 14, lineHeight: 18 }}
            label={'Cancel'}
            isLowerCase
        />
    </View>
}

export const RideDetailsView = ({ activeRequest, driverDetails = null, isDriverLogged = false }) => {
    const driver_details = driverDetails || activeRequest?.driver
    const driver_avatar = driverDetails?.avatar || driver_details?.driver_detail?.photo || driver_details?.vehicle?.vehicle_image
    const fare = activeRequest.fare || activeRequest?.ride?.fare
    const dp = (isDriverLogged) ? activeRequest?.user?.avatar : driver_avatar
    const name = isDriverLogged ? activeRequest?.user?.name : driver_details?.name
    const vehicle = activeRequest?.driver?.vehicle || driverDetails?.vehicle
    return (
        <View style={{ padding: 10 }}>
            <View style={FindRideStyles.cardtop}>
                <View style={FindRideStyles.left}>
                    <ImageView
                        source={dp ? { uri: dp } : images[`captain1`]}
                        style={[styles.avatar]}
                    />
                </View>
                <View style={FindRideStyles.middle}>
                    <Text style={[styles.bold, CommonStyles.font16]}>{name}</Text>
                    {vehicle && <>
                        <Text style={[CommonStyles.font12]}>
                            {vehicle.model}
                        </Text>
                        <Text style={[CommonStyles.font10,{letterSpacing: 1.5}]}>
                            {vehicle.registration_number}
                        </Text>
                    </>}
                    {/* <Timeline
                        data={[
                            activeRequest.from_location,
                            activeRequest.to_location,
                        ]}
                    /> */}
                </View>
                {fare && <View style={[FindRideStyles.right, { alignItems: 'flex-end' }]}>
                    <Text style={[FindRideStyles.name]}>
                        {'\u20B9'}{fare}
                    </Text>
                    {!isDriverLogged && <>
                        <Text style={[FindRideStyles.otpText, { marginTop: 10 }]}>
                            {activeRequest.code}
                        </Text>
                        <Text style={[FindRideStyles.Paragraph]}>
                            OTP
                        </Text>
                    </>}
                </View>}
            </View>
            {/* <View style={FindRideStyles.cardBottom}>
                <View style={FindRideStyles.left}>
                    {activeRequest.duration && (
                        <Text style={[styles.text, styles.bold]}>
                            Duration: {activeRequest.duration}
                        </Text>
                    )}
                </View>
                <View style={FindRideStyles.right}>
                    <Text style={[styles.text, styles.bold]}>
                        Distance: {activeRequest.distance} km
                    </Text>
                </View>
            </View> */}
            {activeRequest?.ride?.id && <Text style={[styles.text, styles.bold, { alignSelf: 'flex-start', paddingLeft: 10 }]}>Ride ID : {activeRequest?.ride?.id}</Text>}
        </View>
    )
}
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 60

export default ({ activeRequest, isDriverLogged }) => {
    const { currentLocation, getCurrentLocation } = useGetCurrentLocation()
    const dispatch = useDispatch()
    const otpRef = useRef(null)
    const [otp, setOtp] = useState('');
    const { activeRideId } = useSelector((state) => isDriverLogged ? state.driver : state.user)

    const [rideRequest, { data: rideRequestData, error: rideRequestError, isLoading: isSubmitOtpLoading }] =
        useRideRequestMutation();

    const [completeRideRequest, { data: completeRideRequestData, error: completeRideRequestError, isLoading: isCompleteRideLoading }] =
        useCompleteRideRequestMutation();

    const getFromLocation = (location = currentLocation) => {
        return {
            Long: location.longitude + '' || 'NA',
            Lat: location.latitude + '' || 'NA',
            City: location.city || 'NA',
            location: location.address || 'NA'
        }
    }
    const otpSubmitHandler = (location) => {
        let payload = {
            request_id: activeRequest.id,
            code: otp,
            from: getFromLocation(location)
        }
        rideRequest(payload).unwrap().then((res) => {
            dispatch(setActiveRide(res))
        }).then((err) => {
            console.log(err)
        })
    }

    const handleSubmitOtp = () => {
        if (isEmpty(otp)) {
            showErrorMessage('Please enter valid code')
            // otpRef?.current?.focus()
            return
        }
        getCurrentLocation(otpSubmitHandler)

    }

    const completeRideHandler = (location) => {
        let payload = {
            request_id: activeRideId || activeRequest?.id,
            to: getFromLocation(location)
        }
        completeRideRequest(payload).unwrap().then((res) => {
            dispatch(updateRideStatus(res))
        }).catch((err) => {
            console.log(err)
            if (err?.status == 400) {
                dispatch(clearDriverState())
            }
        })
    }

    const isOnActiveRide = isDriverLogged && activeRideId || activeRequest.status === RideStatus.ONRIDE
    return (
        <>
            <View style={FindRideStyles.card}>
                <RideDetailsView {...{ activeRequest, isDriverLogged }} />
                {!isOnActiveRide && <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        keyboardType='numeric'
                        placeholder="Enter OTP here"
                        // autoComplete={'sms-otp'}
                        onChangeText={newText => setOtp(newText)}
                        value={otp}
                        // autoFocus
                        ref={otpRef}
                        minLength={4}
                        maxLength={4}
                        style={[FindRideStyles.textInputPickup, { flex: 1, backgroundColor: COLORS.white }]}
                    />
                    <Pressable
                        onPress={() => handleSubmitOtp()}
                        disabled={isSubmitOtpLoading}
                        style={[
                            FindRideStyles.button,
                            { backgroundColor: COLORS.brand_yellow, opacity: isSubmitOtpLoading ? 0.8 : 1 },
                        ]}>
                        <Text
                            style={[
                                FindRideStyles.text,
                                { fontWeight: 'bold', color: COLORS.black },
                            ]}>
                            {'Submit OTP'}
                        </Text>
                    </Pressable>
                </View>}
            </View>
            {isOnActiveRide && <View style={{ flexDirection: 'row', gap: 15, width: getScreen().screenWidth - 30, justifyContent: 'center', flex: 1 }}>
                {(activeRequest?.from_location) && <OpenMapButton route={{ start: activeRequest.from_location, end: activeRequest.to_location, navigate: true }} />}
                <CustomButton
                    onClick={() => getCurrentLocation(completeRideHandler)}
                    disabled={isCompleteRideLoading}
                    styles={
                        { ...FindRideStyles.button, backgroundColor: COLORS.card_bg, minWidth: 160, height: 40, opacity: isCompleteRideLoading ? 0.8 : 1 }
                    }
                    textStyles={{ color: COLORS.black, fontWeight: 400, fontSize: 14, lineHeight: 18 }}
                    label={'Complete Ride'}
                    isLowerCase
                />
            </View>
            }
            <View>{!activeRideId ? cancelRide() : null}</View>
        </>
    );
};