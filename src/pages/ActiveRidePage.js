import React, { useState } from 'react';
import { View, Pressable, Modal, TextInput } from 'react-native';
import _ from 'lodash';
import { Text } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import { ImageView, Icon } from '../components/common';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import { COLORS, RideStatus } from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useDriverEvents } from '../hooks/useDriverSocketEvents';
import requestList from '../mock/rideRequests';
import { useCancelAcceptedRequestMutation, useCompleteRideRequestMutation, useRideRequestMutation } from '../slices/apiSlice';
import { updateRideRequest, updateRideStatus } from '../slices/driverSlice';
import { setActiveRide } from '../slices/userSlice';

const intialState = [
  { message: 'Driver Denied to go to destination', id: 1 },
  { message: 'Unable to contact driver', id: 2 },
  { message: 'My reason is not listed', id: 3 },
];

const Modalpopup = ({ modalVisible, handleModalVisible, activeReq }) => {
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
        "status": RideStatus.DRIVER_CANCELLED,
        "reason": selectedMessage.message
      }).unwrap().then((res) => {
        console.log('cancelAcceptedRequest',res);
        closeModal();
        dispatch(updateRideStatus(res))
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
              Reasons to cancel
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

const Card = ({ activeRequest, currentLocation, setModalVisible }) => {
  const dispatch = useDispatch()

  const fromLocation = {
    Long: currentLocation.longitude,
    Lat: currentLocation.latitude,
    City: currentLocation.city,
    location: currentLocation.address
  }
  const [otp, setOtp] = useState(activeRequest.code);
  const { activeRideId } = useSelector((state) => state.driver)

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
      ride_id: activeRideId,
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
    <View style={FindRideStyles.card} key={activeRequest.id}>
      <View style={{ padding: 10 }}>
        <View style={FindRideStyles.cardtop}>
          <View style={FindRideStyles.left}>
            <ImageView
              source={
                images[`captain${activeRequest.profile_avatar}`] ||
                images[`captain0`]
              }
              style={[styles.avatar]}
            />
          </View>
          <View style={FindRideStyles.middle}>
            <Text style={FindRideStyles.name}>{activeRequest.driver_name}</Text>
            <Timeline
              data={[
                'Kachiguda Railway Station, Nimboliadda, Kachiguda, Hyderabad, Telangana',
                'Lingampally, Telangana',
              ]}
            />
          </View>
          <View style={FindRideStyles.right}>
            <Text style={[FindRideStyles.name, { alignSelf: 'center' }]}>
              {'\u20B9'}
              {activeRequest.price}
            </Text>
          </View>
        </View>
        <View style={FindRideStyles.cardBottom}>
          <View style={FindRideStyles.left}>
            {activeRequest.distance_away && (
              <Text style={[styles.text, styles.bold]}>
                {activeRequest.distance_away} km away
              </Text>
            )}
          </View>
          <View style={FindRideStyles.right}>
            <Text style={[styles.text, styles.bold]}>
              Distance: {activeRequest.total_distance} km
            </Text>
          </View>
        </View>
      </View>
      {activeRideId ? <View style={FindRideStyles.cardBottom}>
        <Pressable
          onPress={() => handleCompleRide()}
          style={[
            FindRideStyles.button,
            { backgroundColor: COLORS.bg_primary },
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

          <Pressable
            onPress={() => handleSubmitOtp()}
            style={[
              FindRideStyles.button,
              { backgroundColor: COLORS.bg_primary },
            ]}>
            <Text
              style={[
                FindRideStyles.text,
                { fontWeight: 'bold', color: COLORS.black },
              ]}>
              {'Submit'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={[
              FindRideStyles.button,
              { backgroundColor: COLORS.brand_yellow },
            ]}>
            <Text
              style={[
                FindRideStyles.text,
                { fontWeight: 'bold', color: COLORS.black },
              ]}>
              {'Cancel Ride'}
            </Text>
          </Pressable>
        </View>
      </View>}

    </View>
  );
};

const ActiveRidePage = ({ currentLocation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { activeRequest } = useSelector((state) => state.driver)

  return (
    <View style={[FindRideStyles.container]}>
      <View style={ActiveRidePageStyles.cardBottom}>
        <Card activeRequest={activeRequest} currentLocation={currentLocation} setModalVisible={setModalVisible} />
        <Modalpopup
          modalVisible={modalVisible}
          handleModalVisible={setModalVisible}
          activeReq={activeRequest}
        />
      </View>
    </View>
  );
};
export default ActiveRidePage;
