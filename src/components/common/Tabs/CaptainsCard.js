import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { ImageView, Text } from '..';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import styles from '../../../styles/MyRidePageStyles';
import images from '../../../util/images';
import { COLORS, RideStatus } from '../../../constants';
import { useCancelRequestMutation, useSendRequestMutation } from '../../../slices/apiSlice';
import { useDispatch } from 'react-redux';
import { updateActiveRequestDrivers } from '../../../slices/userSlice';
import { showErrorMessage } from '../../../util';
import CustomButton from '../CustomButton';
import { useTranslation } from 'react-i18next';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const getButtonStyles = (status) => {
  switch (status) {
    case 'DECLINED': {
      return {
        label: status,
        bg: COLORS.gray,
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
const Card = ({ request_id, ...item }) => {
  // const { request_id } = useSelector(state => state.user?.rideRequests);
  const dispatch = useDispatch();

  const [sendRequest, { data: requestData, error: requestError, isLoading }] =
    useSendRequestMutation();

  const [cancelRequest, { isLoading: isCancelRequestLoading }] = useCancelRequestMutation();

  const updateDriverRequestStatus = (status) => {
    dispatch(updateActiveRequestDrivers({ ...item, status, request_id, vehicle_type: item?.category }));
  }

  const handleSendRequest = item => {
    let payload = { request_id, driver_id: item?.id, fare: item?.fare, vehicle_type: item?.category };
    if (item.status === RideStatus.REQUESTED && !isCancelRequestLoading) {
      cancelRequest(payload).unwrap().then((res) => {
        updateDriverRequestStatus(RideStatus?.USER_CANCELLED);
      }).catch((err) => {
        console.log('cancel request err', err)
      });
    } else if (item.status === RideStatus.AVAILABLE && !isLoading) {
      sendRequest(payload);
    } else {
      showErrorMessage('No action performed on this request.')
    }
  };

  useEffect(() => {
    if (requestError) {
      console.log('requestError', requestError);
      updateDriverRequestStatus(RideStatus?.UNAVAILABLE);
    } else if (requestData) {
      updateDriverRequestStatus(RideStatus?.REQUESTED);
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
            {item?.fare && `₹${item?.fare}`}
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
const CaptainsCard = ({ driversList, keyProp, extraProps, isFetching, onRefresh }) => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  //   const {activeRequestDrivers: driverListByCategory, activeRequestId: request_id} = useSelector(state => state.user);
  //   const { data: categoryResponse, error: rideHistoryError, isFetching } = useGetRequestsByCategoryQuery({ request_id, category: code }, {refetchOnMountOrArgChange: true, skip: !request_id || !code,});
  //   const driversList= driverListByCategory?.[code] || []

  //   useEffect(() => {
  //     if (categoryResponse) {
  //       dispatch(setActiveRequestDrivers(categoryResponse))
  //     }
  //   }, [categoryResponse])
  if (isFetching) {
    return (
      <View>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={[FindRideStyles.card, { padding: 10 }]}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item width={50} height={50} borderRadius={25} marginRight={10} />
                <SkeletonPlaceholder.Item flex={1}>
                  <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} marginBottom={6} />
                  <SkeletonPlaceholder.Item width={80} height={15} borderRadius={4} marginBottom={6} />
                  <SkeletonPlaceholder.Item width={60} height={15} borderRadius={4} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item alignItems="flex-end">
                  <SkeletonPlaceholder.Item width={60} height={20} borderRadius={4} marginBottom={10} />
                  <SkeletonPlaceholder.Item width={100} height={35} borderRadius={4} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        ))}
      </View>
    );
  }
  return (
    <>
      {driversList?.length ? driversList?.map(item => {
        return (
          <Card
            {...{
              ...item,
              ...extraProps,
            }}
            key={`${keyProp}_${item.id}`}
          />
        );
      }) : (
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 30 }}>
          <ImageView
            source={images.rideCancel}
            style={{ width: 80, height: 80, marginBottom: 15, opacity: 0.6 }}
            resizeMode="contain"
          />
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: COLORS.black, marginBottom: 10, fontSize: 18 }}>
            {t('driver_not_found_title')}
          </Text>
          <Text style={{ textAlign: 'center', color: COLORS.gray, marginBottom: 20, fontSize: 14 }}>
            {t('driver_not_found')}
          </Text>
          <CustomButton
            onClick={onRefresh}
            label={t('search_again') || "Refresh"}
            styles={{ width: 140, height: 45, backgroundColor: COLORS.primary, borderRadius: 25 }}
            textStyles={{ color: COLORS.white, fontSize: 16, fontWeight: '600' }}
            isLowerCase={true}
          />
        </View>
      )}
    </>
  )
}


export default CaptainsCard;
