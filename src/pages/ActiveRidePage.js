import React, { useState } from 'react';
import { View, Pressable, Modal, Alert } from 'react-native';
import _ from 'lodash';
import { Text } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import { ImageView, Icon } from '../components/common';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import { COLORS, ROUTES_NAMES } from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import { goBack, navigate } from '../util/navigationService';
import { showErrorMessage } from '../util';

const intialState = [
  { message: 'Driver Denied to go to destination', id: 1 },
  { message: 'Unable to contact driver', id: 2 },
  { message: 'My reason is not listed', id: 3 },
];

const Modalpopup = ({ modalVisible, handleModalVisible }) => {
  const [message, setMessage] = useState(intialState);
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [errorMsg, setErrorMessage] = useState(null)

  const handleCancelReason = (message) => {
    setSelectedMessage(message)
    setErrorMessage(false)
  }
  
  const handleSubmit = () => {
    if (selectedMessage?.id) {
      handleModalVisible(!modalVisible)
      goBack()
    } else {
      setErrorMessage(true)
    }
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onPress={() => {
        handleModalVisible(!modalVisible);
      }}>
      <View
        style={ActiveRidePageStyles.centeredView}
      >
        <View style={ActiveRidePageStyles.modalView}>
          <View>
            <Text style={[ActiveRidePageStyles.modalText]}>Reasons to cancel</Text>
            <View style={ActiveRidePageStyles.content}>
              {message.map((item) => {
                return (
                  <Pressable
                    key={item.id}
                    style={ActiveRidePageStyles.list}
                    onPress={() => handleCancelReason(item)}>
                    <Icon
                      name={selectedMessage?.id === item.id ? 'radiobox-marked' : 'radiobox-blank'}
                      size={'large'}
                      color={COLORS.black}
                    />
                    <Text style={[ActiveRidePageStyles.listTxt]}>
                      {item.message}
                    </Text>
                  </Pressable>
                );
              })}
              {errorMsg && <Text style={{ color: COLORS.primary }}>Please select a reason</Text>}
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              android_ripple={{ color: '#fff' }}
              style={[FindRideStyles.button, { backgroundColor: COLORS.bg_dark }]}
              onPress={() => handleModalVisible(!modalVisible)}>
              <Text style={[FindRideStyles.text, { fontWeight: 'bold', color: COLORS.black }]}>
                {'Close'}
              </Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: '#fff' }}
              style={[FindRideStyles.button]}
              onPress={() => handleSubmit()}>
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

const Card = item => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={FindRideStyles.card} key={item.id}>
      <View style={{ padding: 10 }}>
        <View style={FindRideStyles.cardtop}>
          <View style={FindRideStyles.left}>
            <ImageView
              source={
                images[`captain${item.profile_avatar}`] || images[`captain0`]
              }
              style={[styles.avatar]}
            />
          </View>
          <View style={FindRideStyles.middle}>
            <Text style={FindRideStyles.name}>{item.driver_name}</Text>
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
              {item.price}
            </Text>
          </View>
        </View>
        <View style={FindRideStyles.cardBottom}>
          <View style={FindRideStyles.left}>
            {item.distance_away && (
              <Text style={[styles.text, styles.bold]}>
                {item.distance_away} km away
              </Text>
            )}
          </View>
          <View style={FindRideStyles.right}>
            <Text style={[styles.text, styles.bold]}>
              Distance: {item.ride_distance} km
            </Text>
          </View>
        </View>
      </View>
      <Modalpopup
        modalVisible={modalVisible}
        handleModalVisible={setModalVisible}
      />
      <View style={FindRideStyles.cardBottom}>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={[FindRideStyles.button, { backgroundColor: COLORS.brand_yellow }]}>
          <Text style={[FindRideStyles.text, { fontWeight: 'bold', color: COLORS.black }]}>
            {'Cancel Ride'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const ActiveRidePage = () => {
  let item = {
    distance_away: 1,
    driver_name: 'John Deo',
    price: 432,
    profile_avatar: 2,
    seats: 4,
    type: 'car',
    vehicle_color: 'White',
    vehicle_icon: 'https://apnicabi.com/assets/icons/car.png',
    vehicle_id: 1,
    vehicle_model: 'Volvo XC60',
    ride_distance: 53,
    id: 2,
  };
  return (
    <View style={[FindRideStyles.container]}>
      <View style={ActiveRidePageStyles.cardBottom}>
        <Card {...item} />
      </View>
    </View>
  );
};
export default ActiveRidePage;
