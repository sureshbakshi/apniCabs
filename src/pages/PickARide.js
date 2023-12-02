import React, {useEffect, useState} from 'react';
import {View, Pressable, ScrollView, Text, Switch} from 'react-native';
import styles from '../styles/MyRidePageStyles';
import {ImageView} from '../components/common';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import _ from 'lodash';
import FindRideStyles from '../styles/FindRidePageStyles';
import {COLORS, DriverAvailableStatus, ROUTES_NAMES} from '../constants';
import {navigate} from '../util/navigationService';
import {emitAcceptRequest} from '../sockets/driverSockets';
import {useSelector} from 'react-redux';
import {
  useDriverEvents,
  useEmitDriverStatus,
} from '../hooks/useDriverSocketEvents';
import {useUpdateDriverStatusMutation} from '../slices/apiSlice';
import useGetDriverDetails, { useDisptachDriverDetails } from '../hooks/useGetDriverDetails';
import { isAvailable } from '../util';

const Card = ({item, handleAcceptRequest, handleDeclineRequest}) => {
  return (
    <View style={FindRideStyles.card} key={item.vehicle_id}>
      <View style={{padding: 10}}>
        <View style={FindRideStyles.cardtop}>
          <View style={FindRideStyles.left}>
            {/* <ImageView
                source={
                  images[`captain${item.profile_avatar}`] || images[`captain0`]
                }
                style={[styles.avatar]}
              /> */}
          </View>
          <View style={FindRideStyles.middle}>
            <Text style={FindRideStyles.name}>{item.user_name}</Text>
            <Timeline
              data={[
                'Kachiguda Railway Station, Nimboliadda, Kachiguda, Hyderabad, Telangana',
                'Lingampally, Telangana',
              ]}
            />
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
      <View style={FindRideStyles.cardBottom}>
        <Pressable
          style={[FindRideStyles.button, {backgroundColor: COLORS.primary}]}
          onPress={() => handleDeclineRequest(item)}>
          <Text style={FindRideStyles.text}>{'Decline'}</Text>
        </Pressable>
        <Pressable
          style={[FindRideStyles.button, {backgroundColor: COLORS.green}]}
          onPress={() => handleAcceptRequest(item)}>
          <Text style={FindRideStyles.text}>{'Accept'}</Text>
        </Pressable>
      </View>
    </View>
  );
};
const DriverCard = ({list}) => {
  const {emitDeclineRequestEvent} = useDriverEvents();
  return list.map((item, key) => {
    return (
      <Card
        item={item}
        handleAcceptRequest={emitAcceptRequest}
        handleDeclineRequest={emitDeclineRequestEvent}
        key={`${key}_${item.vehicle_id}`}
      />
    );
  });
};

export const PickARide = () => {
  const profile = useSelector(state => state.auth?.userInfo);

  const [
    updateDriverStatus,
    {data: driverStatus, error: driverStatusError, isLoginLoading},
  ] = useUpdateDriverStatusMutation();
  useDisptachDriverDetails(driverStatus)
  
  
  const {driverInfo, userInfo} = useSelector(state => state.auth);
  useGetDriverDetails(userInfo?.id, { skip: driverInfo?.id })

  const {emitDriverStatusEvent} = useDriverEvents(!isOnline);

  const toggleSwitch = val =>
    updateDriverStatus({is_available: val ? 1: 0});

  useEffect(() => {
    if (driverStatusError) {
      console.log('driverStatusError', driverStatusError);
    } else if (driverStatus) {
      console.log('driverStatus', driverStatus);
    }
  }, [driverStatus, driverStatusError]);
  const isOnline = isAvailable(driverInfo)
  const rideRequests = []
  return (
    <View style={FindRideStyles.container}>
      <View
        style={[
          FindRideStyles.switchBtn,
          {backgroundColor: isOnline ? COLORS.green : COLORS.primary},
        ]}>
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
          {rideRequests?.length ? (
            <ScrollView>
              <DriverCard list={rideRequests} />
            </ScrollView>
          ) : null}
        </View>
      )}
    </View>
  );
};
