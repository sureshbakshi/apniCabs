import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Modal, TextInput } from 'react-native';
import { get } from 'lodash';
import { Text } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import { ImageView, Icon } from '../components/common';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import { COLORS, RideStatus, USER_INFORMATION, VEHICLE_INFORMATION } from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useCancelAcceptedRequestMutation, useCompleteRideRequestMutation, useRideRequestMutation } from '../slices/apiSlice';
import { updateRideStatus, setActiveRide, clearDriverState } from '../slices/driverSlice';
import { clearUserState } from '../slices/userSlice';
import { getScreen, getVehicleImage, isDriver, isUser, showErrorMessage } from '../util';
import useGetActiveRequests from '../hooks/useGetActiveRequests';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import openMap from 'react-native-open-maps';
import ActiveMapPage from './ActiveMap';
import CustomDialog from '../components/common/CustomDialog';
import { delay } from 'lodash';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { CancelReasonDialog } from '../components/common/cancelReasonDialog';
import { setDialogStatus } from '../slices/authSlice';




const VehicleCard = ({ activeRequest, details, avatar, showOtp = false }) => {
  const avatarUri = get(activeRequest, avatar, null);
  const vehicleImage = get(activeRequest, 'driver.vehicle.type_vehicle_type.code', null);
  const defaultImage = showOtp ? images['captain0'] : getVehicleImage(vehicleImage)

  return (
    <View style={FindRideStyles.card}>
      <View style={{ padding: 10 }}>
        <View style={FindRideStyles.cardtop}>
          <View style={FindRideStyles.left}>
            <ImageView
              source={avatarUri ? { uri: avatarUri } : defaultImage
              }
              style={[styles.avatar]}
            />
          </View>
          <View style={FindRideStyles.middle}>
            {details.map((item) => {
              const value = Array.isArray(item.key) ? item.key.map(key => get(activeRequest, key, 'NA')).join(' | ') : get(activeRequest, item.key, null)
              return <Text key={item.key} style={[FindRideStyles.name, item.props?.style]}>{value}</Text>
            })}
          </View>
          <View style={[FindRideStyles.right, { justifyContent: 'center', alignItems: 'center' }]}>
            {showOtp && <Text style={[FindRideStyles.name, { alignSelf: 'center', fontWeight: 'bold', color: COLORS.brand_blue }]}>
              OTP: {activeRequest.code}
            </Text>}
            <Pressable onPress={() => RNImmediatePhoneCall.immediatePhoneCall('08071175144')} style={{ backgroundColor: COLORS.green, borderRadius: 20, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="phone" size="large" color={COLORS.white} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const cancelRide = (setModalVisible) => {
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

const Card = ({ activeRequest, currentLocation, setModalVisible, isDriverLogged }) => {

  const dispatch = useDispatch()
  let fromLocation = {}
  if (currentLocation) {
    fromLocation = {
      Long: currentLocation.longitude + '' || 'NA',
      Lat: currentLocation.latitude + '' || 'NA',
      City: currentLocation.city || 'NA',
      location: currentLocation.address || 'NA'
    }
  }
  const otpRef = useRef(null)

  const [otp, setOtp] = useState('');
  const { activeRideId } = useSelector((state) => isDriverLogged ? state.driver : state.user)

  const [rideRequest, { data: rideRequestData, error: rideRequestError, rideRequestDataLoading }] =
    useRideRequestMutation();

  const [completeRideRequest, { data: completeRideRequestData, error: completeRideRequestError, completeRideRequestDataLoading }] =
    useCompleteRideRequestMutation();

  const handleSubmitOtp = () => {
    if (isEmpty(otp)) {
      showErrorMessage('Please enter valid code')
      otpRef?.current?.focus()
      return
    }
    let payload = {
      request_id: activeRequest.id,
      code: otp,
      from: fromLocation
    }
    rideRequest(payload).unwrap().then((res) => {
      console.log(res);
      dispatch(setActiveRide(res))
    }).then((err) => {
      console.log(err)
    })
  }


  const handleCompleRide = () => {
    let payload = {
      request_id: activeRideId || activeRequest?.id,
      to: fromLocation
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
            onPress={() => handleCompleRide()}
            style={[
              FindRideStyles.button,
              { backgroundColor: COLORS.brand_yellow },
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
              placeholder="Enter Otp here"
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
            {cancelRide(setModalVisible)}
            <Pressable
              onPress={() => handleSubmitOtp()}
              style={[
                FindRideStyles.button,
                { backgroundColor: COLORS.brand_yellow },
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
        </View>}</View> : <View>{!activeRideId ? cancelRide(setModalVisible) : null}</View>}

    </View>
  );
};

const ActiveRidePage = ({ currentLocation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch()
  const isDriverLogged = isDriver();
  const { getCurrentLocation, location } = useGetCurrentLocation(isDriverLogged)
  useGetActiveRequests()


  const { activeRequest, activeRideId, statusUpdate } = useSelector((state) => isDriverLogged ? state.driver : state.user);

  const openMapApp = () => {
    openMap({ start: activeRequest?.from_location, end: activeRequest?.to_location, navigate: true });
  }
  const Cards = ({ title, children }) => {
    return <View>
      <Text style={[styles.name, styles.blackColor, styles.bold]}>
        {title}:
      </Text>
      {children}
    </View>
  }
  const { screenHeight } = getScreen()
  const statusMessages = {
    [RideStatus.USER_CANCELLED]: {
      title: "Booking Cancelled",
      description: `We're sorry, but your ride has been canceled by the ${activeRequest?.user?.name || 'passenger'}.`,
      reason: statusUpdate?.reason,
      subText: `We understand that unexpected situations may arise, and we appreciate your understanding. Your availability is now back to active, and you are ready to receive new ride requests.`
    },
    [RideStatus.DRIVER_CANCELLED]: {
      title: "Booking Cancelled",
      description: `We're sorry, but your ride has been canceled by the driver. `,
      reason: statusUpdate?.reason,
      subText: `We apologize for any inconvenience caused. Thank you for using Apnicabi. We appreciate your understanding.`
    },
    [RideStatus.COMPLETED]: {
      title: "Trip Completed",
      description: isDriverLogged ? `Thank you for completing the ride with Apnicabi. We appreciate your dedication to providing a safe and reliable transportation experience for our passengers.
    `: 'Thank you for riding with Apnicabi! Your trip has been successfully completed  and look forward to serving you again soon.'
    }
  }

  const rideStatusModalInfo = statusUpdate?.status ? statusMessages[statusUpdate?.status] : null
  const clearRideState = () => {
    setModalVisible(false);
    delay(() => {
      dispatch(isDriverLogged ? clearDriverState() : clearUserState())
    }, 10)
  }
  return (
    <View style={[FindRideStyles.container]}>
      <View style={{ height: (screenHeight - 530) }}>
        {activeRequest?.id && <ActiveMapPage activeRequest={activeRequest} currentLocation={location || currentLocation} activeRideId={activeRideId} />}
      </View>
      <View style={[ActiveRidePageStyles.cardBottom, { backgroundColor: COLORS.bg_light, padding: 10, paddingBottom: 3 }]}>
        {(activeRideId && activeRequest?.from_location) && <Pressable
          onPress={openMapApp}
        >
          <View style={[FindRideStyles.button, { backgroundColor: COLORS.primary, flexDirection: 'row', marginBottom: 5 }]} >
            <Icon name="directions" size="large" color={COLORS.white} />
            <Text style={[FindRideStyles.text, { fontWeight: 'bold', marginLeft: 10 }]}>Get Route Map</Text>
          </View>
        </Pressable>}
        {isDriverLogged ? <Cards title={'User Details'}>
          <VehicleCard activeRequest={activeRequest} details={USER_INFORMATION} avatar={'user.avatar'} />
        </Cards> :
          <Cards title={'Vehicle Details'}>
            <VehicleCard activeRequest={activeRequest} details={VEHICLE_INFORMATION} avatar={'driver.vehicle.vehicle_image'} showOtp={true} />
          </Cards>}
        <Cards title={'Driver & Ride Details'}>
          {!isEmpty(activeRequest) && <Card isDriverLogged={isDriverLogged} activeRequest={activeRequest} currentLocation={location || currentLocation} setModalVisible={setModalVisible} />}
        </Cards>
        {/* <CancelReasonDialog
          modalVisible={modalVisible}
          handleModalVisible={setModalVisible}
          activeReq={activeRequest}
          isDriverLogged={isDriverLogged}
        /> */}
        {rideStatusModalInfo ? <>
          <CustomDialog title={rideStatusModalInfo.title} closeCb={clearRideState} openDialog={true}>
            <Text style={[ActiveRidePageStyles.content]}>{rideStatusModalInfo.description}</Text>
            {rideStatusModalInfo?.reason ? <Text style={[ActiveRidePageStyles.content]}> Reason for Cancellation: {rideStatusModalInfo.reason}</Text> : null}
            {rideStatusModalInfo?.subText ? <Text style={[ActiveRidePageStyles.content]}>{rideStatusModalInfo.subText}</Text> : null}
          </CustomDialog>
        </> : null}
      </View>
    </View>
  );
};
export default ActiveRidePage;
