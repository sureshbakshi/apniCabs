import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { ImageView, Text } from '..';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import styles from '../../../styles/MyRidePageStyles';
import images from '../../../util/images';
import Timeline from '../timeline/Timeline';
import _ from 'lodash';
import { COLORS } from '../../../constants';
import { useSendRequestMutation } from '../../../slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateDriversRequest } from '../../../slices/userSlice';
import { showErrorMessage } from '../../../util';

const Card = item => {
  const [cancelRequestBtn, setCancelRequestBtn] = useState(false);
  const { request_id } = useSelector(state => state.user?.rideRequests);
  const dispatch = useDispatch();

  const [sendRequest, { data: requestData, error: requestError, isLoading }] =
    useSendRequestMutation();

  const handleSendRequest = item => {
    if (!item.status) {
      let payload = { request_id, driver_id: item.driver_id };
      sendRequest(payload);
    } else {
      showErrorMessage('Request already sent.')
    }
  };

  const handleCancelRequest = item => {
    if (item.status) {
      let payload = { request_id, driver_id: item.driver_id };
      sendRequest(payload);
    } else {
      showErrorMessage('Request already sent.')
    }
  };


  useEffect(() => {
    if (requestError) {
      console.log('requestError', requestError);
    } else if (requestData) {
      setCancelRequestBtn(true);
      dispatch(updateDriversRequest(requestData));
    }
  }, [requestData, requestError]);

  if (isLoading) {
    return null;
  }
  const getButtonStyles = (status) => {
    switch (status) {
      case 'DECLINED': {
        return {
          label: status,
          bg: COLORS.primary,
          color: COLORS.white
        }
      }
      case 'REQUESTED': {
        return {
          label: status,
          bg: COLORS.brand_blue,
          color: COLORS.white
        }
      }
      default: {
        return {
          label: 'Send Request',
          bg: COLORS.brand_yellow,
          color: COLORS.black
        }
      }
    }
  }
  const actionButtonInfo = getButtonStyles(item?.status)
  const vehicleImage = (item) => item?.vehicle_details?.photo ? { uri: item?.vehicle_details?.photo } : images[`captain4`]
  return (
    <View style={FindRideStyles.card} key={item?.driver_id}>
      <Timeline />
      <View style={FindRideStyles.cardtop}>
        <View style={FindRideStyles.left}>
          <ImageView
            source={vehicleImage(item)}
            style={[styles.avatar]}
          />
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={FindRideStyles.name}>{item.name}</Text>
          <Timeline data={[item.from, item.to]} />
        </View>
        <View style={FindRideStyles.right}>
          <Text style={[FindRideStyles.name, { alignSelf: 'center' }]}>
            {'\u20B9'}
            {item.price}
          </Text>
          <Text style={FindRideStyles.address}>{item.distance?.text}</Text>
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
        <View style={[FindRideStyles.right,{padding:0,paddingBottom:5}]}>
          <Pressable
            style={[FindRideStyles.button, { backgroundColor: actionButtonInfo.bg, minHeight: 40,  marginHorizontal: 3,paddingVertical:0 }]}
            onPress={() => handleSendRequest(item)}>
            <Text style={[FindRideStyles.text, { color: actionButtonInfo.color, fontWeight: 'bold', textTransform: 'capitalize', height: 'auto' }]}>
              {actionButtonInfo.label}
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
