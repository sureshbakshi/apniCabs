import React, { useState } from 'react';
import { View, Pressable, Modal, TextInput } from 'react-native';
import _ from 'lodash';
import { Text } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import { ImageView, Icon } from '../components/common';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import { COLORS } from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import { useSelector } from 'react-redux';
import { useDriverEvents } from '../hooks/useDriverSocketEvents';
import requestList from '../mock/rideRequests';

const intialState = [
  { message: 'Driver Denied to go to destination', id: 1 },
  { message: 'Unable to contact driver', id: 2 },
  { message: 'My reason is not listed', id: 3 },
];

const Modalpopup = ({ modalVisible, handleModalVisible, activeReq }) => {
  const [message, setMessage] = useState(intialState);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [errorMsg, setErrorMessage] = useState(null);
  const { emitCancelRequestEvent } = useDriverEvents();
  const handleCancelReason = message => {
    setSelectedMessage(message);
    setErrorMessage(false);
  };

  const closeModal = () => handleModalVisible(!modalVisible);
  const handleSubmit = () => {
    if (selectedMessage?.id) {
      emitCancelRequestEvent(activeReq, closeModal);
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
                        selectedMessage?.id === item.id
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

const Card = ({ activeRequest, setModalVisible }) => {

  const [otp, setOtp] = useState();

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
      <View>
        <TextInput
          keyboardType='numeric'
          placeholder="Enter Otp here"
          onChangeText={newText => setOtp(newText)}
          value={otp}
          autoFocus
          minLength={6}
          maxLength={6}
          style={FindRideStyles.textInputPickup}
        />
      </View>
      <View style={FindRideStyles.cardBottom}>

        <Pressable
          onPress={() => console.log(otp)}
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
    </View>
  );
};

const ActiveRidePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {activeRequest} = useSelector((state) => state.driver)
  // const activeRequest = requestList[0];

  return (
    <View style={[FindRideStyles.container]}>
      <View style={ActiveRidePageStyles.cardBottom}>
        <Card activeRequest={activeRequest} setModalVisible={setModalVisible} />
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
