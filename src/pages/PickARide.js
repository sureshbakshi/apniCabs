import React, { useEffect, useState } from 'react';
import { View, Pressable, ScrollView, Text, Switch, SafeAreaView } from 'react-native';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import FindRideStyles from '../styles/FindRidePageStyles';
import { COLORS, DriverAvailableStatus, ROUTES_NAMES, RideStatus, default_btn_styles } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import useGetDriverDetails, { useUpdateDriverStatus } from '../hooks/useGetDriverDetails';
import { updateRideRequest } from '../slices/driverSlice';
import SocketStatus from '../components/common/SocketStatus';
import SearchLoader from '../components/common/SearchLoader';
import { useGetFeeQuery, useUpdateRequestMutation } from '../slices/apiSlice';
import { Icon } from '../components/common';
import { navigate } from '../util/navigationService';
import CustomButton from '../components/common/CustomButton';
import CommonStyles from '../styles/commonStyles';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Card = ({ item, handleAcceptRequest, handleDeclineRequest, isLoading }) => {
  const { t } = useTranslation();
  const request = item?.Request || item
  return (
    <View style={FindRideStyles.pickCard} key={item.id}>
      <View style={{ justifyContent: 'flex-end', marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{t('distance')}</Text>
          <Text>{request?.duration} - {request?.distance} km</Text>
        </View>
        <Text style={[FindRideStyles.name, { alignSelf: 'flex-end', fontSize: 18, lineHeight: 24 }]}>
          {'\u20B9'}{item?.fare || item?.amount}
        </Text>
      </View>
      <View style={[FindRideStyles.cardtop]}>
        <View style={{ flex: 1 }}>
          {/* <Text style={FindRideStyles.name}>{item.user_name}</Text> */}
          <Timeline
            data={[
              request?.from_location,
              request?.to_location,
            ]}
            numberOfLines={2}
          />
        </View>
        {/* <View style={[FindRideStyles.right]}>
          <Text style={[FindRideStyles.name, { alignSelf: 'center' }]}>
            {'\u20B9'}
            {item.fare || item?.driver_requests?.fare}
          </Text>
        </View> */}
      </View>
      {/* <View style={FindRideStyles.cardBottom}>
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
      </View> */}
      <View style={FindRideStyles.cardBottom}>
        <CustomButton
          disabled={isLoading}
          onClick={() => handleDeclineRequest(item)}
          label={'Decline'}
          {...default_btn_styles}
          styles={{ backgroundColor: COLORS.card_bg, opacity: isLoading ? 0.8 : 1, ...default_btn_styles.styles }}
          textStyles={{ ...default_btn_styles.textStyles, color: COLORS.black }}
        />
        <CustomButton
          disabled={isLoading}
          onClick={() => handleAcceptRequest(item)}
          label={'Accept'}
          {...default_btn_styles}
          styles={{ opacity: isLoading ? 0.8 : 1, ...default_btn_styles.styles }}
        />
      </View>
    </View>
  );
};
const DriverCard = ({ list }) => {
  const dispatch = useDispatch()
  const [updateRequest, { data: updatedRequest, isLoading }] = useUpdateRequestMutation();

  const requestHandler = (status, request) => {
    const payload = {
      "status": status,
      "request_id": request?.request_id
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
        isLoading={isLoading}
        key={`${key}_${item.id}`}
      />
    );
  });
};

export const PickARide = () => {
  const insets = useSafeAreaInsets();
  const isSocketConnected = useSelector((state) => state.auth.isSocketConnected);
  const { rideRequests, onlineStatus: driverStatus, walletInfo } = useSelector(state => state.driver);
  const feeQuery = useGetFeeQuery({}, { refetchOnMountOrArgChange: true });
  const { data: fees, error: feeError, isLoading: feeLoading, isSuccess: feeSuccess } = feeQuery;
  const is_available = driverStatus === DriverAvailableStatus.ONLINE || driverStatus === DriverAvailableStatus.BUSY
  const [isOnline, toggleDriveStatus] = useState(is_available)
  const { t } = useTranslation();
  useGetDriverDetails({ refetchOnMountOrArgChange: true })
  const updateDriverStatus = useUpdateDriverStatus();


  const toggleSwitch = () => {
    toggleDriveStatus(!isOnline)
    updateDriverStatus(!isOnline, toggleDriveStatus)
  }

  // useEffect(() => {
  //   if (is_available !== isOnline) {
  //     toggleDriveStatus(is_available)
  //   }
  // }, [is_available, isOnline]);

  const showStatusButton = (rideRequests?.length < 1 || !isSocketConnected)
  return (
    <SafeAreaView style={[FindRideStyles.container]}>
      {/* <View style={[FindRideStyles.pageContainer]}> */}
      <ContainerWrapper>
        <View>
          {/* <Text style={FindRideStyles.headerText}>
          {isOnline ? 'Online' : 'Offline'}
        </Text> */}
          <View style={[{
            padding: 0, alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }]}>

            {walletInfo && <Pressable
              style={[CommonStyles.shadow, { height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 40, marginRight: 10, marginTop: 10, backgroundColor: COLORS.white, paddingHorizontal: 15 }]}
              onPress={() => navigate(ROUTES_NAMES.wallet,)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <Icon name="wallet-outline" size="large" color={COLORS.gray} />
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>{walletInfo?.amount}</Text> Credits</Text>
              </View>
            </Pressable>}
            <Pressable
              style={[CommonStyles.shadow, { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 40, marginRight: 20, marginTop: 10, backgroundColor: COLORS.white }]}
              onPress={() => navigate(ROUTES_NAMES.notifications)}>
              <Icon name="bell-badge-outline" size="large" color={COLORS.gray} />
            </Pressable>
            {/* <Switch
            trackColor={{ false: COLORS.white, true: COLORS.white }}
            thumbColor={isOnline ? COLORS.light_green : COLORS.primary_soft}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={Boolean(isOnline)}
            style={{ transform: [{ scaleX: .9 }, { scaleY: .9 }] }}
          /> */}
          </View>
        </View>
        {(showStatusButton) && <View style={{ position: 'absolute', bottom: insets.bottom + 15, right: 15, zIndex: 2, }}>
          <CustomButton
            label={isOnline ? 'Online' : 'Offline'}
            styles={{ width: 63, height: 63, borderRadius: 100, paddingHorizontal: 5, backgroundColor: isOnline ? COLORS.green : COLORS.orange, }}
            textStyles={{ fontSize: 12, lineHeight: 12, textAlign: 'center', marginTop: 2 }}
            contentContainerStyles={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            isLowerCase
            iconLeft={{ name: 'account-circle-outline', size: 'large' }}
            iconStyles={{ paddingRight: 0 }}
            onClick={toggleSwitch}
          />
        </View>}
        {/* <Text>{isSocketConnected}</Text> */}
        {isOnline || rideRequests.length > 0 ? (
          <>
            {!isSocketConnected ? <SocketStatus /> :
              rideRequests?.length <= 0 ? <SearchLoader msg={t('search_ride_msg')} source={images.homeBanner} /> :
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
        {walletInfo?.amount < (fees?.wallet_min || 20) && <View style={{ width: showStatusButton ? '80%' : '100%' }}>
          <Pressable
            style={[CommonStyles.shadow, { padding: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 25, backgroundColor: COLORS.primary, paddingHorizontal: 14 }]}
            onPress={() => navigate(ROUTES_NAMES.wallet,)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <Text style={{ color: COLORS.white }}>Your credits is running low. Please recharge to ensure you don't miss any ride requests.</Text>
            </View>
          </Pressable>
        </View>}

      </ContainerWrapper>
      {/* </View> */}
    </SafeAreaView>
  );
};
