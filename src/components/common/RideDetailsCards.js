import React, { useRef, useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import FindRideStyles from '../../styles/FindRidePageStyles';
import { ImageView, Text } from '../common';
import styles from '../../styles/MyRidePageStyles';
import images from '../../util/images';
import Timeline from '../common/timeline/Timeline';
import { COLORS, RideStatus } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useCompleteRideRequestMutation, useRideRequestMutation } from '../../slices/apiSlice';
import { updateRideStatus, setActiveRide, clearDriverState } from '../../slices/driverSlice';
import { showErrorMessage } from '../../util';
import useGetCurrentLocation from '../../hooks/useGetCurrentLocation';
import { setDialogStatus } from '../../slices/authSlice';

const cancelRide = () => {
    const dispatch = useDispatch();
    return <Pressable
        onPress={() => dispatch(setDialogStatus(true))}
        style={[
            FindRideStyles.button,
            { backgroundColor: COLORS.primary },
        ]}>
        <Text
            style={[
                FindRideStyles.text,
                { fontWeight: 'bold', color: COLORS.white },
            ]}>
            {'Cancel Ride'}
        </Text>
    </Pressable>
}

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
            console.log(res);
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
        console.log('completeRideRequest', payload)
        completeRideRequest(payload).unwrap().then((res) => {
            console.log(res);
            dispatch(updateRideStatus(res))
        }).catch((err) => {
            console.log(err)
            if (err?.status == 400) {
                dispatch(clearDriverState())
            }
        })
    }

    const driver_avatar = activeRequest?.driver?.driver_detail?.photo || activeRequest?.driver?.vehicle?.vehicle_image

    return (
        <View style={FindRideStyles.card}>
            <View style={{ padding: 10 }}>
                <View style={FindRideStyles.cardtop}>
                    <View style={FindRideStyles.left}>
                        <ImageView
                            source={driver_avatar ? { uri: driver_avatar } : images[`captain1`]}
                            style={[styles.avatar]}
                        />
                    </View>
                    <View style={FindRideStyles.middle}>
                        <Text style={[FindRideStyles.name, styles.bold]}>{activeRequest?.driver?.name}</Text>
                        <Timeline
                            data={[
                                activeRequest.from_location,
                                activeRequest.to_location,
                            ]}
                        />
                    </View>
                    <View style={FindRideStyles.right}>
                        <Text style={[FindRideStyles.name, { alignSelf: 'center' }]}>
                            {'\u20B9'}
                            {activeRequest.fare}
                        </Text>
                    </View>
                </View>
                <View style={FindRideStyles.cardBottom}>
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
                </View>
            </View>
            {isDriverLogged ? <View>
                {activeRideId || activeRequest.status === RideStatus.ONRIDE ? <View style={FindRideStyles.cardBottom}>
                    <Pressable
                        onPress={() => getCurrentLocation(completeRideHandler)}
                        disabled={isCompleteRideLoading}
                        style={[
                            FindRideStyles.button,
                            { backgroundColor: COLORS.brand_yellow, opacity: isCompleteRideLoading ? 0.8 : 1 },
                        ]}>
                        <Text
                            style={[
                                FindRideStyles.text,
                                { fontWeight: 'bold', color: COLORS.black },
                            ]}>
                            {'Completed Ride'}
                        </Text>
                    </Pressable>

                </View> : <View>
                    <View>
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
                            style={FindRideStyles.textInputPickup}
                        />
                    </View>
                    <View style={FindRideStyles.cardBottom}>
                        {cancelRide()}
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

                    </View>
                </View>}</View> : <View>{!activeRideId ? cancelRide() : null}</View>}

        </View>
    );
};