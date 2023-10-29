import React from 'react';
import {View, Pressable} from 'react-native';
import {ImageView, Text} from '..';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import styles from '../../../styles/MyRidePageStyles';
import images from '../../../util/images';
import Timeline from '../timeline/Timeline';
import {navigate} from '../../../util/navigationService';
import _ from 'lodash';
import {ROUTES_NAMES} from '../../../constants';
import {useSendRequestMutation} from '../../../slices/apiSlice';

const Card = item => {
  const [SendRequest, {data: requestData, error, isLoading}] =
    useSendRequestMutation();
  const handleNavigate = item => {
    // navigate(ROUTES_NAMES.activeRide)
    // dispatch sendrequest with request_id and vehicle_id
    let payload = {request_id: item.request_id, vehicle_id: item.vehicle_id};
    console.log(payload);
    SendRequest(payload);
  };
  if (isLoading || error) {
    return null;
  }
  return (
    <View style={FindRideStyles.card} key={item.id}>
      <Timeline />
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
          {/* <Text style={FindRideStyles.review}>({item.size} Reviews)</Text> */}
          <Timeline data={[item.from, item.to]} />
        </View>
        <View style={FindRideStyles.right}>
          <Text style={[FindRideStyles.name, {alignSelf: 'center'}]}>
            {'\u20B9'}
            {item.price}
          </Text>
          <Text style={FindRideStyles.address}>{item.distance.text}</Text>
          {/* <Text style={FindRideStyles.address}>{item.seats} Seats left</Text> */}
        </View>
      </View>
      <View style={FindRideStyles.cardBottom}>
        <View style={FindRideStyles.left}>
          {item.distance_away && (
            <Text style={[styles.text, styles.bold]}>
              {item.distance_away} away{' '}
            </Text>
          )}
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={[styles.text, styles.bold]}>
            {item.vehicle_model} | {item.vehicle_color}
          </Text>
        </View>
        <View style={FindRideStyles.right}>
          <Pressable
            style={FindRideStyles.button}
            onPress={()=>handleNavigate(item)}>
            <Text style={FindRideStyles.text}>{'Request'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const CaptainsCard = ({list, keyProp, extraProps}) =>
  list.map(item => {
    return (
      <Card
        {...{
          ...item,
          ...extraProps,
        }}
        key={`${keyProp}_${item.vehicle_id}`}
      />
    );
  });

export default CaptainsCard;
