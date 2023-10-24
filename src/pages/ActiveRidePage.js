import React, {useState} from 'react';
import {View, Pressable, Modal, Alert} from 'react-native';
import _ from 'lodash';
import {Text} from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import {ImageView, Icon} from '../components/common';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import {COLORS, ROUTES_NAMES} from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import {navigate} from '../util/navigationService';

const intialState = [
  {message: 'Driver Denied to go to destination'},
  {message: 'Unable to contact driver'},
  {message: 'My reason is not listed'},
];

const Modalpopup = ({modalVisible, handleModalVisible}) => {
  const [message, setMessage] = useState(intialState);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onPress={() => {
        handleModalVisible(!modalVisible);
      }}>
      <Pressable
        style={ActiveRidePageStyles.centeredView}
        onPress={() => {
          handleModalVisible(!modalVisible);
        }}>
        <View style={ActiveRidePageStyles.modalView}>
          <View>
            <Text style={[ActiveRidePageStyles.modalText]}>Cancel</Text>
            <View style={ActiveRidePageStyles.content}>
              {message.map((item, key) => {
                return (
                  <Pressable
                    key={key}
                    android_ripple={{color: '#ccc'}}
                    style={ActiveRidePageStyles.list}>
                    <Icon
                      name={'radiobox-blank'}
                      size={'large'}
                      color={COLORS.black}
                    />
                    <Text style={[ActiveRidePageStyles.listTxt]}>
                      {item.message}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <Pressable
            android_ripple={{color: '#fff'}}
            style={[FindRideStyles.button, {flex: 0}]}
            onPress={() => handleModalVisible(!modalVisible)}>
            <Text style={[FindRideStyles.text, {fontWeight: 'bold'}]}>
              {'Cancel Ride'.toUpperCase()}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const Card = item => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={FindRideStyles.card} key={item.id}>
      <View style={{padding: 10}}>
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
            <Text style={[FindRideStyles.name, {alignSelf: 'center'}]}>
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
          style={[FindRideStyles.button, {backgroundColor: COLORS.orange}]}>
          <Text style={[FindRideStyles.text, {fontWeight: 'bold'}]}>
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
