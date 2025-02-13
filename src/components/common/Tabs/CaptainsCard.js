import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { ImageView, Text } from '..';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import styles from '../../../styles/MyRidePageStyles';
import images from '../../../util/images';
import _ from 'lodash';
import { COLORS, RideStatus } from '../../../constants';
import { useCancelRequestMutation, useGetRequestsByCategoryQuery, useSendRequestMutation } from '../../../slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRequestDrivers, updateActiveRequestDrivers, updateDriversRequest } from '../../../slices/userSlice';
import { showErrorMessage } from '../../../util';
import CustomButton from '../CustomButton';

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
        label: 'Cancel Request',
        bg: COLORS.brand_yellow,
        color: COLORS.black
      }
    }
    case 'CLOSED': {
      return {
        label: 'Cancelled',
        bg: COLORS.gray,
        color: COLORS.black
      }
    }
    case 'UNAVAILABLE': {
      return {
        label: 'Unavailable',
        bg: COLORS.gray,
        color: COLORS.black
      }
    }
    case 'USER_CANCELLED': {
      return {
        label: 'You Cancelled',
        bg: COLORS.gray,
        color: COLORS.white
      }
    }
    case 'DRIVER_CANCELLED': {
      return {
        label: 'Driver Cancelled',
        bg: COLORS.gray,
        color: COLORS.black
      }
    }

    default: {
      return {
        label: 'Send Request',
        bg: COLORS.primary,
        color: COLORS.white
      }
    }
  }
}
const Card = ({request_id,...item}) => {
  // const { request_id } = useSelector(state => state.user?.rideRequests);
  const dispatch = useDispatch();

  const [sendRequest, { data: requestData, error: requestError, isLoading }] =
    useSendRequestMutation();

  const [cancelRequest, { data: cancelRequestData, error: cancelRequestError, isLoading: isCancelRequestLoading }] =
    useCancelRequestMutation();

  const handleSendRequest = item => {
    let payload = { request_id, driver_id: item?.id, fare: item?.fare, category: item?.category };
    if (item.status === RideStatus.REQUESTED) {
      cancelRequest(payload);
    } else if (!item.status) {
      sendRequest(payload);
    } else {
      showErrorMessage('No action performed on this request.')
    }
  };

  const updateDriverStatus = (status) => {
    dispatch(updateActiveRequestDrivers({ ...item, status, request_id, category: item?.category }));
  }

  useEffect(() => {
    if (cancelRequestError) {
      console.log('cancelRequestError', cancelRequestError);
    } else if (cancelRequestData) {
      updateDriverStatus(RideStatus?.USER_CANCELLED);
    }
  }, [cancelRequestData, cancelRequestError]);

  useEffect(() => {
    if (requestError) {
      console.log('requestError', requestError);
      updateDriverStatus(RideStatus?.UNAVAILABLE);
    } else if (requestData) {
      updateDriverStatus(RideStatus?.REQUESTED);
    }
  }, [requestData, requestError]);

  if (isLoading) {
    return null;
  }
  const actionButtonInfo = getButtonStyles(item?.status)
  const vehicleImage = (item) => item?.vehicle_details?.photo ? { uri: item?.vehicle_details?.photo } : images[`captain4`]
  const isDisabled = item?.status === RideStatus.CLOSED || item?.status === RideStatus.UNAVAILABLE
  return (
    <View style={[FindRideStyles.card, { opacity: isDisabled ? 0.6 : 1 }]} key={item?.id}>
      {/* <Timeline /> */}
      <View style={FindRideStyles.cardtop}>
        <View style={FindRideStyles.left}>
          <ImageView
            source={vehicleImage(item)}
            style={[styles.avatar]}
          />
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={FindRideStyles.name}>{item?.details?.name}</Text>
          <Text style={FindRideStyles.vehicle}>{item?.details?.model}</Text>
          <Text style={[FindRideStyles.vehicle]}>{item?.details?.colour}</Text>

          {/* <Timeline data={[item.from, item.to]} /> */}
        </View>
        <View style={FindRideStyles.right}>
          <Text style={[FindRideStyles.name, { alignSelf: 'flex-end' }]}>
            ₹{item.fare}
          </Text>
          <CustomButton
            // styles={[{ , height: 40, marginHorizontal: 3, paddingVertical: 0, opacity: isLoading || isCancelRequestLoading ? 0.6 : 1 }]}
            styles={{ opacity: isLoading || isCancelRequestLoading ? 0.6 : 1, maxHeight: 38, backgroundColor: actionButtonInfo.bg, marginTop: 5 }}
            textStyles={{ fontSize: 14, lineHeight: 18, color: actionButtonInfo.color }}
            onClick={() => isDisabled ? null : handleSendRequest(item)}
            disabled={isLoading || isCancelRequestLoading}
            label={isLoading || isCancelRequestLoading ? 'Loading...' : actionButtonInfo.label}
            isLowerCase
          >
            <Text style={[FindRideStyles.text, { color: actionButtonInfo.color, fontWeight: 'bold', textTransform: 'capitalize', height: 'auto' }]}>
              {isLoading || isCancelRequestLoading ? 'Loading...' : actionButtonInfo.label}
            </Text>
          </CustomButton>
          {/* <Text style={FindRideStyles.address}>{item.distance?.text}</Text> */}
        </View>
      </View>
      {/* <View style={FindRideStyles.cardBottom}>
        <View style={FindRideStyles.left}>
          {item?.distance_away && (
            <Text style={[styles.text, styles.bold]}>
              {item.distance_away} away{' '}
            </Text>
          )}
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={[styles.text, styles.bold]}>
            {item.colour}
          </Text>
        </View>
      </View> */}
    </View>
  );
};
const CaptainsCard = ({ driversList, keyProp, extraProps, isfetching }) => {
// const dispatch = useDispatch();
//   const {activeRequestDrivers: driverListByCategory, activeRequestId: request_id} = useSelector(state => state.user);
//   const { data: categoryResponse, error: rideHistoryError, isFetching } = useGetRequestsByCategoryQuery({ request_id, category: code }, {refetchOnMountOrArgChange: true, skip: !request_id || !code,});
//   const driversList= driverListByCategory?.[code] || []

//   useEffect(() => {
//     if (categoryResponse) {
//       dispatch(setActiveRequestDrivers(categoryResponse))
//     }
//   }, [categoryResponse])
if(isfetching){
  return <Text>Loading...</Text>
}
  return (
    driversList?.length ? driversList?.map(item => {
      return (
        <Card
          {...{
            ...item,
            ...extraProps,
          }}
          key={`${keyProp}_${item.id}`}
        />
      );
    }) : <Text style={{ padding: 15, textAlign: 'center', fontWeight: 'bold' }}>Drivers not found at the moment. Please try later!</Text>
  )
}


export default CaptainsCard;
