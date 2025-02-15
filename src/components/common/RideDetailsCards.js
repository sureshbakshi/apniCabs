import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, TextInput, Keyboard, Platform } from 'react-native';
import FindRideStyles from '../../styles/FindRidePageStyles';
import { ImageView, Text } from '../common';
import styles from '../../styles/MyRidePageStyles';
import images from '../../util/images';
import Timeline from '../common/timeline/Timeline';
import { COLORS, RideStatus, SOCKET_EVENTS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useCompleteRideRequestMutation, useRideRequestMutation } from '../../slices/apiSlice';
import { updateRideStatus, setActiveRide, clearDriverState } from '../../slices/driverSlice';
import { getScreen, showErrorMessage } from '../../util';
import useGetCurrentLocation from '../../hooks/useGetCurrentLocation';
import { clearRideChats, setDialogStatus } from '../../slices/authSlice';
import CustomButton from './CustomButton';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import OpenMapButton from './OpenMapButton';
import CommonStyles from '../../styles/commonStyles';
import { getColorNBg } from '../../pages/MyRidesPage';
import ScreenContainer from '../ScreenContainer';
import socket from './socket';


const cancelRide = (activeRequestInfo, isDriverLogged) => {
    const dispatch = useDispatch();
    const phoneNumber = activeRequestInfo?.details?.phone;
    return <View style={{ flexDirection: 'row', gap: 15, width: getScreen().screenWidth - 30, justifyContent: 'center', flex: 1 }}>
        <CustomButton
            onClick={() => phoneNumber ? RNImmediatePhoneCall.immediatePhoneCall(`+91${phoneNumber}`) : null}
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

export const AvatarInfo = ({ dp, vehicle, avatarContainerStyles, avatarStyles, name, canShowVehicleInfo }) => {
    return (
        <View style={[{ flexDirection: 'row', gap: 10, ...avatarContainerStyles }]}>
            <ImageView
                source={dp ? { uri: dp } : images[`captain1`]}
                style={[styles.avatar, { ...avatarStyles }]}
            />
            <View>
                <Text style={[styles.bold, CommonStyles.font16]}>{name}</Text>
                {(canShowVehicleInfo && vehicle) && <>
                    <Text style={[CommonStyles.font12, { color: COLORS.neutral_gray }]}>
                        {vehicle.model}
                    </Text>
                    <Text style={[CommonStyles.font10, { letterSpacing: 1.5, color: COLORS.neutral_gray }]}>
                        {vehicle.registration_number}
                    </Text>
                </>}
            </View>
        </View>
    )
}

export const RideDetailsView = ({ activeRequestInfo, isDriverLogged = false, isOnRide = true, avatarStyles = {}, avatarContainerStyles = {}, containerStyles = {} }) => {
    const {details,fare} = activeRequestInfo
    const driver_avatar = details?.photo || details?.vehicle?.photo
    const name = details?.name 
    const vehicle = details?.vehicle
    const { color, label } = getColorNBg(activeRequestInfo?.status)
    return (
        <View style={{ padding: 10, ...containerStyles }}>
            <View style={[FindRideStyles.cardtop, { justifyContent: 'space-between' }]}>
                <AvatarInfo {...{ dp: driver_avatar, vehicle, name, avatarStyles, canShowVehicleInfo: !isDriverLogged }} avatarContainerStyles={{ alignItems: 'center', ...avatarContainerStyles }} />
                {fare && isOnRide && <View style={[{ alignItems: 'flex-end' }]}>
                    <Text style={[FindRideStyles.name]}>
                        {'\u20B9'}{fare}
                    </Text>
                    {!isDriverLogged && <>
                        <Text style={[FindRideStyles.otpText, { marginTop: 10 }]}>
                            {activeRequestInfo.otp}
                        </Text>
                        <Text style={[FindRideStyles.Paragraph]}>
                            OTP
                        </Text>
                    </>}
                </View>}
            </View>
            {!isOnRide && <View style={{ marginTop: 10 }}><Timeline
                data={[
                    activeRequestInfo.from_location,
                    activeRequestInfo.to_location,
                ]}
                numberOfLines={1}
                textStyles={{ fontSize: 12 }}
            /></View>}
            {/* <View style={FindRideStyles.cardBottom}>
                <View style={FindRideStyles.left}>
                    {activeRequestInfo.duration && (
                        <Text style={[styles.text, styles.bold]}>
                            Duration: {activeRequestInfo.duration}
                        </Text>
                    )}
                </View>
                <View style={FindRideStyles.right}>
                    <Text style={[styles.text, styles.bold]}>
                        Distance: {activeRequestInfo.distance} km
                    </Text>
                </View>
            </View> */}
            {
                activeRequestInfo?.distance && !isOnRide && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                    <Text style={[styles.text2]}>Duration: {activeRequestInfo?.duration}</Text>
                    <Text style={[styles.text2]}>Distance: {activeRequestInfo?.distance} Km</Text>
                </View>
            }
            {activeRequestInfo?.id && !isOnRide && <Text style={[styles.text2, { marginVertical: 5, }]} numberOfLines={1}>Ride ID : {activeRequestInfo?.id}</Text>}
            {!isOnRide && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                <Text style={[FindRideStyles.name]}>{fare ? `\u20B9${fare}` : ''}</Text>
                <Text style={[{ color: color }]}>{label}</Text>
                {/* <Text style={styles.address}>3 Seats left</Text> */}
            </View>}
        </View>
    )
}
const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 60
const getFromLocation = (location = currentLocation) => {
    return {
        Long: location.longitude + '' || 'NA',
        Lat: location.latitude + '' || 'NA',
        City: location.city || 'NA',
        location: location.address || 'NA'
    }
}
export const RenderOTP = ({ activeRequestInfo }) => {
    const { getCurrentLocation } = useGetCurrentLocation()
    const [otp, setOtp] = useState('');
    const [rideRequest, { data: rideRequestData, error: rideRequestError, isLoading: isSubmitOtpLoading }] =
        useRideRequestMutation();
    const dispatch = useDispatch()

    const otpSubmitHandler = (location) => {
        let payload = {
            request_id: activeRequestInfo.id,
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
        } else {
            getCurrentLocation(otpSubmitHandler)
        }

    }

    useEffect(() => {
        if (otp.length === 4) {
            handleSubmitOtp();
            Keyboard.dismiss()
        }
    }, [otp])

    return (
        <View style={{ flexDirection: 'row' }}>
            <TextInput
                keyboardType='numeric'
                placeholder="Enter OTP here"
                // autoComplete={'sms-otp'}
                onChangeText={newText => setOtp(newText)}
                value={otp}
                // autoFocus
                minLength={4}
                maxLength={4}
                style={[FindRideStyles.textInputPickup, { flex: 1, backgroundColor: COLORS.white }]}
            />
            <Pressable
                onPress={() => handleSubmitOtp()}
                disabled={isSubmitOtpLoading}
                style={[
                    FindRideStyles.button,
                    { backgroundColor: COLORS.brand_yellow, opacity: isSubmitOtpLoading ? 0.4 : 1 , borderColor: COLORS.brand_yellow, borderWidth: 0.5},
                ]}>
                <Text
                    style={[
                        FindRideStyles.text,
                        { fontWeight: 'bold', color: COLORS.black },
                    ]}>
                    {'Submit OTP'}
                </Text>
            </Pressable>
        </View>
    )
}

export default ({ activeRequestInfo, isDriverLogged }) => {
    const { currentLocation, getCurrentLocation } = useGetCurrentLocation()
    const dispatch = useDispatch()
    const [completeRideRequest, { data: completeRideRequestData, error: completeRideRequestError, isLoading: isCompleteRideLoading }] =
        useCompleteRideRequestMutation();


    const completeRideHandler = (location) => {
        let payload = {
            request_id: activeRequestInfo?.id,
            to: getFromLocation(location)
        }
        completeRideRequest(payload).unwrap().then((res) => {
            console.log(res)
            dispatch(updateRideStatus(res));
            // dispatch(clearRideChats());
            // socket.emit(SOCKET_EVENTS.rideCompleted)
        }).catch((err) => {
            console.log(err)
            if (err?.status == 400) {
                dispatch(clearDriverState())
            }
        })
    }
    const isActiveRide = (activeRequestInfo.status === RideStatus.ONRIDE && isDriverLogged)
    const isAccepted = (activeRequestInfo.status === RideStatus.ACCEPTED)
    return (
        <>
            <View style={[FindRideStyles.card]}>
                <ScreenContainer>
                    <RideDetailsView {...{ activeRequestInfo, isDriverLogged }} />
                    {(isAccepted && isDriverLogged) && <RenderOTP {...{ activeRequestInfo }} />}
                </ScreenContainer>
            </View>
            {(isActiveRide) && <View style={{ flexDirection: 'row', gap: 15, width: getScreen().screenWidth - 30, justifyContent: 'center', flex: 1 }}>
                <OpenMapButton route={{ start: activeRequestInfo.from, end: activeRequestInfo.to, navigate: true }} />
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
            <View>{isAccepted ? cancelRide(activeRequestInfo, isDriverLogged) : null}</View>
        </>
    );
};