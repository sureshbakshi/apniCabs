import React, {useState} from 'react';
import {View, Pressable, ScrollView, Text, Switch} from 'react-native';
import styles from '../styles/MyRidePageStyles';
import {ImageView} from '../components/common';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import _ from 'lodash';
import FindRideStyles from '../styles/FindRidePageStyles';
import { COLORS, ROUTES_NAMES } from '../constants';
import { navigate } from '../util/navigationService';
import { acceptRequest } from '../sockets/driverSockets';
import { useSelector } from 'react-redux';
import { useEmitDriverStatus } from '../hooks/useDriverSocketEvents';

const Card = item => {
  return (
    <>
    <View  style={FindRideStyles.card} key={item.id}>
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
            <Timeline data={['Kachiguda Railway Station, Nimboliadda, Kachiguda, Hyderabad, Telangana', 'Lingampally, Telangana']}/>
          {/* <Timeline data={[item.from, item.to]} /> */}
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
            <Text style={[styles.text, styles.bold]}>{item.distance_away} km away</Text>
          )}
        </View>
        <View style={FindRideStyles.right}>
          <Text style={[styles.text, styles.bold]}>
            Distance: {item.ride_distance} km
          </Text>
        </View>
      </View>
      </View>
      <View style={FindRideStyles.cardBottom}>
          <Pressable style={[FindRideStyles.button,{backgroundColor:COLORS.primary}]}>
            <Text style={FindRideStyles.text}>{'Decline'}</Text>
          </Pressable>
          <Pressable style={[FindRideStyles.button,{backgroundColor:COLORS.green}]} onPress={ () => item.handleNavigation(item)}>
            <Text style={FindRideStyles.text}>{'Accept'}</Text>
          </Pressable>
      </View>
    </View>
    
    </>
  );
};
const DriverCard = ({list}) => {
  const handleNavigation = (item) =>{
    acceptRequest(item)
  }
  return list.map((item, key) => {
    return (
      <Card
        {...{
          ...item,
          handleNavigation: handleNavigation
        }}
        key={`${key}_${item.vehicle_id}`}
      />
    );
  });
};

export const PickARide = () => {
  const {isOnline} = useSelector((state) => state.driver)
  const updateDriverStatus = useEmitDriverStatus()
  const toggleSwitch = () => updateDriverStatus(!isOnline);
  

  const list = [
    {
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
      ride_distance: 53
    },
    {
      distance_away: 2,
      driver_name: 'Rajesh babu',
      price: 400,
      profile_avatar: 1,
      seats: 4,
      type: 'car',
      vehicle_color: 'White',
      vehicle_icon: 'https://apnicabi.com/assets/icons/car.png',
      vehicle_id: 1,
      vehicle_model: 'Volvo',
      ride_distance: 48

    },
  ];
  return (
    <View style={FindRideStyles.container}>
      <View style={[FindRideStyles.switchBtn,{backgroundColor: isOnline ? COLORS.green : COLORS.primary}]}>
        <Text style={FindRideStyles.headerText}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        <Switch
          trackColor={{false: COLORS.white, true: COLORS.white}}
          thumbColor={isOnline ? COLORS.light_green : COLORS.primary_soft}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isOnline}
        />
      </View>

      {isOnline && (
        <View style={FindRideStyles.section}>
          <ScrollView>
            <DriverCard list={list} />
          </ScrollView>
        </View>
      )}
    </View>
  );
};
