import React, { useEffect, useState } from 'react';
import { View, Pressable, ScrollView, Text, Switch } from 'react-native';
import styles from '../styles/MyRidePageStyles';
import { ImageView } from '../components/common';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import _ from 'lodash';
import FindRideStyles from '../styles/FindRidePageStyles';
import { COLORS, DriverAvailableStatus, ROUTES_NAMES, RideStatus } from '../constants';
import { navigate } from '../util/navigationService';
import { emitAcceptRequest } from '../sockets/driverSockets';
import { useDispatch, useSelector } from 'react-redux';
import {
  useDriverEvents,
  useEmitDriverStatus,
} from '../hooks/useDriverSocketEvents';
import { useDriverActiveRideMutation, useDriverActiveRideQuery, useUpdateDriverStatusMutation, useUpdateRequestMutation } from '../slices/apiSlice';
import useGetDriverDetails, { useDisptachDriverDetails } from '../hooks/useGetDriverDetails';
import { isAvailable } from '../util';
import { updateRideRequest, setDriverStatus } from '../slices/driverSlice';

const Card = ({ item, handleAcceptRequest, handleDeclineRequest }) => {
  return (
    <View style={FindRideStyles.card} key={item.id}>
      <View style={{ padding: 10 }}>
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
                item.from_location,
                item.to_location,
              ]}
            />
            {/* <Timeline data={[item.from, item.to]} /> */}
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
            {item?.driver_distance && (
              <Text style={[styles.text, styles.bold]}>
                {item.driver_distance} km away
              </Text>
            )}
          </View>
          <View style={FindRideStyles.right}>
            <Text style={[styles.text, styles.bold]}>
              Distance: {item.distance} km
            </Text>
          </View>
        </View>
      </View>
      <View style={FindRideStyles.cardBottom}>
        <Pressable
          style={[FindRideStyles.button, { backgroundColor: COLORS.primary }]}
          onPress={() => handleDeclineRequest(item)}>
          <Text style={FindRideStyles.text}>{'Decline'}</Text>
        </Pressable>
        <Pressable
          style={[FindRideStyles.button, { backgroundColor: COLORS.green }]}
          onPress={() => handleAcceptRequest(item)}>
          <Text style={FindRideStyles.text}>{'Accept'}</Text>
        </Pressable>
      </View>
    </View>
  );
};
const DriverCard = ({ list }) => {
  const dispatch = useDispatch()
  const [updateRequest, { data: updatedRequest }] = useUpdateRequestMutation();

  const requestHandler = (status, request) => {
    const payload = {
      "status": status,
      "request_id": request?.id
    }
    updateRequest(payload)
  }

  useEffect(() => {
    if (updatedRequest) {
      dispatch(updateRideRequest(updatedRequest))
    }
  }, [updatedRequest])

  return list.map((item, key) => {
    return (
      <Card
        item={item}
        handleAcceptRequest={(request) => requestHandler(RideStatus.ACCEPTED, request)}
        handleDeclineRequest={(request) => requestHandler(RideStatus.DECLINED, request)}
        key={`${key}_${item.id}`}
      />
    );
  });
};

export const PickARide = () => {
  const dispatch = useDispatch()
  const { isOnline: status, rideRequests } = useSelector(state => state.driver);
  const { driverInfo, userInfo } = useSelector(state => state.auth);
  const [ isOnline, setToggleSwitch] = useState(status === DriverAvailableStatus.ONLINE)
  const [ updateDriverStatus ] = useUpdateDriverStatusMutation();
  const { data: activeRideDetails } = useDriverActiveRideQuery();
  useGetDriverDetails(userInfo?.id, { skip: driverInfo?.id })

  const toggleSwitch = val => {
    setToggleSwitch(val)
  }

  useEffect(() => {
    updateDriverStatus({ is_available: isOnline ? 1 : 0 }).unwrap().then((res) => { 
      dispatch(setDriverStatus(res))
    }).catch(() => setToggleSwitch(!val))
  }, [isOnline]);

  useEffect(() => {
    if (activeRideDetails) {
      dispatch(updateRideRequest(activeRideDetails))
    }
  }, [activeRideDetails])
  return (
    <View style={FindRideStyles.container}>
      <View
        style={[
          FindRideStyles.switchBtn,
          { backgroundColor: isOnline ? COLORS.green : COLORS.primary },
        ]}>
        <Text style={FindRideStyles.headerText}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        <Switch
          trackColor={{ false: COLORS.white, true: COLORS.white }}
          thumbColor={isOnline ? COLORS.light_green : COLORS.primary_soft}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={Boolean(isOnline)}
        />
      </View>

      {isOnline ? (
        <View style={FindRideStyles.section}>
          {rideRequests?.length ? (
            <ScrollView>
              <DriverCard list={rideRequests} />
            </ScrollView>
          ) : null}
        </View>
      ): null}
    </View>
  );
};
