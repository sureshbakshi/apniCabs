import React, { useEffect, useState } from 'react';
import { View, Pressable, ScrollView, Text, Switch, SafeAreaView } from 'react-native';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import { isEqual } from 'lodash';
import FindRideStyles from '../styles/FindRidePageStyles';
import { COLORS, ROUTES_NAMES, RideStatus } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import useGetDriverDetails, { useUpdateDriverStatus } from '../hooks/useGetDriverDetails';
import { _isDriverOnline } from '../util';
import { updateRideRequest, setDriverStatus } from '../slices/driverSlice';
import SocketStatus from '../components/common/SocketStatus';
import SearchLoader from '../components/common/SearchLoader';
import { useUpdateRequestMutation } from '../slices/apiSlice';
import { Icon } from '../components/common';
import { navigate } from '../util/navigationService';


const Card = ({ item, handleAcceptRequest, handleDeclineRequest }) => {
  return (
    <View style={FindRideStyles.card} key={item.id}>
      <View style={{ padding: 10 }}>
        <View style={[FindRideStyles.cardtop]}>
          <View style={[FindRideStyles.middle]}>
            {/* <Text style={FindRideStyles.name}>{item.user_name}</Text> */}
            <Timeline
              data={[
                item.from_location,
                item.to_location,
              ]}
              numberOfLines={0}
            />
          </View>
          <View style={[FindRideStyles.right]}>
            <Text style={[FindRideStyles.name, { alignSelf: 'center' }]}>
              {'\u20B9'}
              {item.fare || item?.driver_requests?.fare}
            </Text>
          </View>
        </View>
        <View style={FindRideStyles.cardBottom}>
          <View style={[FindRideStyles.left, { padding: 0 }]}>
            {item?.driver_distance && (
              <Text style={[styles.text, styles.bold]}>
                {item.driver_distance} km away
              </Text>
            )}
          </View>
          <View style={[FindRideStyles.right, { padding: 0 }]}>
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
  const { isSocketConnected } = useSelector((state) => state.auth)
  const { rideRequests } = useSelector(state => state.driver);
  const { driverInfo, userInfo } = useSelector(state => state.auth);
  const status = _isDriverOnline()
  const [isOnline, setToggleSwitch] = useState(status)

  const updateDriverStatus = useUpdateDriverStatus();

  useGetDriverDetails(userInfo?.id, { skip: driverInfo?.id })

  const toggleSwitch = val => {
    setToggleSwitch(val)
  }

  useEffect(() => {
    if (!isEqual(status, isOnline)) {
      updateDriverStatus(isOnline, setToggleSwitch)
    }
  }, [isOnline]);


  return (
    <SafeAreaView style={FindRideStyles.container}>
      <View
        style={[
          FindRideStyles.switchBtn,
          { backgroundColor: isOnline ? COLORS.green : COLORS.primary },
        ]}>
        <Text style={FindRideStyles.headerText}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        <View style={[{
          padding: 0, alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }]}>
          <Pressable
            style={{ paddingHorizontal: 5, marginRight: 5 }}
            android_ripple={{ color: '#ccc' }}
            onPress={() => navigate(ROUTES_NAMES.notifications)}>
            <Icon name="bell-badge" size="large" color={COLORS.white} />
          </Pressable>
          <Switch
            trackColor={{ false: COLORS.white, true: COLORS.white }}
            thumbColor={isOnline ? COLORS.light_green : COLORS.primary_soft}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={Boolean(isOnline)}
            style={{ transform: [{ scaleX: .9 }, { scaleY: .9 }] }}
          />
        </View>
      </View>
      {isOnline ? (
        <>
          {!isSocketConnected ? <SocketStatus /> :
            rideRequests?.length <= 0 ? <SearchLoader msg='Looking for ride requests! Please be in online status.' source={images.searchLoader} /> :
              <View style={FindRideStyles.section}>
                {rideRequests?.length ? (
                  <ScrollView>
                    <DriverCard list={rideRequests} />
                  </ScrollView>
                ) : null}
              </View>
          }
        </>
      ) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
          You are currently offline. Turn on your availability to receive ride requests.</Text>
      </View>}
    </SafeAreaView>
  );
};
