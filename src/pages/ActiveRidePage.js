import React, { useState } from 'react';
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
import { useDriverEvents } from '../hooks/useDriverSocketEvents';
import requestList from '../mock/rideRequests';
import { useCancelAcceptedRequestMutation, useCompleteRideRequestMutation, useRideRequestMutation } from '../slices/apiSlice';
import { updateRideRequest, updateRideStatus } from '../slices/driverSlice';
import { cancelActiveRequest, setActiveRide } from '../slices/userSlice';
import { isDriver, isUser } from '../util';
import useGetActiveRequests from '../hooks/useGetActiveRequests';
const intialState = [
  { message: 'Driver Denied to go to destination', id: 1 },
  { message: 'Unable to contact driver', id: 2 },
  { message: 'My reason is not listed', id: 3 },
];

const Modalpopup = ({ modalVisible, handleModalVisible, activeReq, isDriverLogged }) => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState(intialState);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [errorMsg, setErrorMessage] = useState(null);

  const [cancelAcceptedRequest, { data: cancelAcceptedRequestData, error: cancelAcceptedRequestError, cancelAcceptedRequestDataLoading }] =
    useCancelAcceptedRequestMutation();

  const { emitCancelRequestEvent } = useDriverEvents();
  const handleCancelReason = message => {
    setSelectedMessage(message);
    setErrorMessage(false);
  };

  const closeModal = () => handleModalVisible(!modalVisible);
  const handleSubmit = () => {
    if (selectedMessage.id) {
      cancelAcceptedRequest({
        "request_id": activeReq.id,
        "driver_id": activeReq?.driver?.id,
        "status": isDriverLogged ? RideStatus.DRIVER_CANCELLED : RideStatus.USER_CANCELLED,
        "reason": selectedMessage.message,
        "driver_id": activeReq.driver_id
      }).unwrap().then((res) => {
        console.log('cancelAcceptedRequest', res);
        closeModal();
        dispatch(isDriverLogged ? updateRideStatus(res) : cancelActiveRequest(res))

      }).then((err) => {
        console.log(err)
      })
      // emitCancelRequestEvent(activeReq, closeModal);
    } else {
      setErrorMessage(true);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onPress={() => {
        handleModalVisible(!modalVisible);
      }}>
      <View style={ActiveRidePageStyles.centeredView}>
        <View style={ActiveRidePageStyles.modalView}>
          <View>
            <Text style={[ActiveRidePageStyles.modalText]}>
              Reason to Cancel
            </Text>
            <View style={ActiveRidePageStyles.content}>
              {message.map(item => {
                return (
                  <Pressable
                    key={item.id}
                    style={ActiveRidePageStyles.list}
                    onPress={() => handleCancelReason(item)}>
                    <Icon
                      name={
                        selectedMessage.id === item.id
                          ? 'radiobox-marked'
                          : 'radiobox-blank'
                      }
                      size={'large'}
                      color={COLORS.black}
                    />
                    <Text style={[ActiveRidePageStyles.listTxt]}>
                      {item.message}
                    </Text>
                  </Pressable>
                );
              })}
              {errorMsg && (
                <Text style={{ color: COLORS.primary }}>
                  Please select a reason
                </Text>
              )}
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              android_ripple={{ color: '#fff' }}
              style={[FindRideStyles.button, { backgroundColor: COLORS.bg_dark }]}
              onPress={() => handleModalVisible(!modalVisible)}>
              <Text
                style={[
                  FindRideStyles.text,
                  { fontWeight: 'bold', color: COLORS.black },
                ]}>
                {'Close'}
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: '#fff' }}
              style={[FindRideStyles.button]}
              onPress={handleSubmit}>
              <Text style={[FindRideStyles.text, { fontWeight: 'bold' }]}>
                {'Submit'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const VehicleCard = ({ activeRequest, details, avatar }) => {
  const avatarUri = get(activeRequest, avatar, null)

  return (
    <View style={FindRideStyles.card}>
      <View style={{ padding: 10 }}>
        <View style={FindRideStyles.cardtop}>
          <View style={FindRideStyles.left}>
            <ImageView
              source={avatarUri ? { uri: avatarUri } : images[`captain0`]
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
        </View>
      </View>
    </View>
  );
};

const cancelRide = (setModalVisible) => {
  return <Pressable
    onPress={() => setModalVisible(true)}
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
      Long: currentLocation.longitude+'',
      Lat: currentLocation.latitude+'',
      City: currentLocation.city,
      location: currentLocation.address
    }
  }

  const [otp, setOtp] = useState(activeRequest.code);
  const { activeRideId } = useSelector((state) => isDriverLogged ? state.driver : state.user)

  const [rideRequest, { data: rideRequestData, error: rideRequestError, rideRequestDataLoading }] =
    useRideRequestMutation();

  const [completeRideRequest, { data: completeRideRequestData, error: completeRideRequestError, completeRideRequestDataLoading }] =
    useCompleteRideRequestMutation();

  const handleSubmitOtp = () => {
    let payload = {
      request_id: activeRequest.id,
      code: otp,
      from: fromLocation
    }
    console.log('payload', payload)
    rideRequest(payload).unwrap().then((res) => {
      console.log(res);
      dispatch(setActiveRide(res))
    }).then((err) => {
      console.log(err)
    })
  }


  const handleCompleRide = () => {
    let payload = {
      request_id: activeRideId,
      to: fromLocation
    }
    console.log('completeRideRequest', payload)
    completeRideRequest(payload).unwrap().then((res) => {
      console.log(res);
      dispatch(updateRideStatus(res))
    }).then((err) => {
      console.log(err)
    })
  }

  return (
    <View style={FindRideStyles.card}>
      <View style={{ padding: 10 }}>
        <View style={FindRideStyles.cardtop}>
          <View style={FindRideStyles.left}>
            <ImageView
              source={
                images[`captain${activeRequest?.driver?.avatar}`] ||
                images[`captain0`]
              }
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
        {activeRideId ? <View style={FindRideStyles.cardBottom}>
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
              autoFocus
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
  const isDriverLogged = isDriver();
  useGetActiveRequests()

  const { activeRequest } = useSelector((state) => isDriverLogged ? state.driver : state.user);

  const Cards = ({ title, children }) => {
    return <View>
      <Text style={[styles.name, styles.primaryColor, styles.bold]}>
        {title}:
      </Text>
      {children}
    </View>
  }

  return (
    <View style={[FindRideStyles.container]}>
      <View style={ActiveRidePageStyles.cardBottom}>
        {isDriverLogged ? <Cards title={'User Details'}>
          <VehicleCard activeRequest={activeRequest} details={USER_INFORMATION} avatar={'user.avatar'} />
        </Cards> :
          <Cards title={'Vehicle Details'}>
            <Text style={styles.end}>OTP: {activeRequest.code}</Text>
            <VehicleCard activeRequest={activeRequest} details={VEHICLE_INFORMATION} avatar={'driver.vehicle.vehicle_image'} />
          </Cards>}
        <Cards title={'Ride Details'}>
          <Card isDriverLogged={isDriverLogged} activeRequest={activeRequest} currentLocation={currentLocation} setModalVisible={setModalVisible} />
        </Cards>
        <Modalpopup
          modalVisible={modalVisible}
          handleModalVisible={setModalVisible}
          activeReq={activeRequest}
          isDriverLogged={isDriverLogged}
        />
      </View>
    </View>
  );
};
export default ActiveRidePage;
