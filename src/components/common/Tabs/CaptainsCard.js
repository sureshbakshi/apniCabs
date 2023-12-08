import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { ImageView, Text } from '..';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import styles from '../../../styles/MyRidePageStyles';
import images from '../../../util/images';
import Timeline from '../timeline/Timeline';
import { navigate } from '../../../util/navigationService';
import _ from 'lodash';
import { ROUTES_NAMES, RideStatus } from '../../../constants';
import { useSendRequestMutation } from '../../../slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateDriversRequest } from '../../../slices/userSlice';
import { showErrorMessage } from '../../../util';

const Card = item => {
  const { request_id } = useSelector(state => state.user?.rideRequests);

  const dispatch = useDispatch();
  const [sendRequest, { data: requestData, error: requestError, isLoading }] =
    useSendRequestMutation();
  const handleSendRequest = item => {
    if (!item.status) {
      let payload = { request_id, driver_id: item.driver_id,fare: item.price };
      sendRequest(payload);
    }else{
      showErrorMessage('Request already sent.')
    }

  };
  useEffect(() => {
    if (requestError) {
      console.log('requestError', requestError);
    } else if (requestData) {
      dispatch(updateDriversRequest(requestData));
    }
  }, [requestData, requestError]);

  if (isLoading) {
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
          <Text style={FindRideStyles.name}>{item.name}</Text>
          {/* <Text style={FindRideStyles.review}>({item.size} Reviews)</Text> */}
          <Timeline data={[item.from, item.to]} />
        </View>
        <View style={FindRideStyles.right}>
          <Text style={[FindRideStyles.name, { alignSelf: 'center' }]}>
            {'\u20B9'}
            {item.price}
          </Text>
          <Text style={FindRideStyles.address}>{item.distance.text}</Text>
          {/* <Text style={FindRideStyles.address}>{item.seats} Seats left</Text> */}
        </View>
      </View>
      <View style={FindRideStyles.cardBottom}>
        <View style={FindRideStyles.left}>
          {item?.distance_away && (
            <Text style={[styles.text, styles.bold]}>
              {item.distance_away} away{' '}
            </Text>
          )}
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={[styles.text, styles.bold]}>
            {item?.vehicle_details?.name} | {item.colour}
          </Text>
        </View>
        <View style={FindRideStyles.right}>
          <Pressable
            style={FindRideStyles.button}
            onPress={() => handleSendRequest(item)}>
            <Text style={FindRideStyles.text}>
              {item.status ? item.status : 'Request'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const CaptainsCard = ({ list, keyProp, extraProps }) =>
  list.map(item => {
    return (
      <Card
        {...{
          ...item,
          ...extraProps,
        }}
        key={`${keyProp}_${item.driver_id}`}
      />
    );
  });

export default CaptainsCard;
