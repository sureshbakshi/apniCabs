import React, { useEffect } from 'react';
import { View } from 'react-native';
import FindRideStyles from '../styles/FindRidePageStyles';
import { COLORS, SOCKET_EVENTS } from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getScreen, isDriver } from '../util';
import RideDetailsCards from '../components/common/RideDetailsCards';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { Text } from '../components/common';
import Timeline from '../components/common/timeline/Timeline';
import { SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useGetDriverActiveRequests from '../hooks/useGetDriverActiveRequests';
import useGetUserActiveRequests from '../hooks/useGetUserActiveRequests';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import { useTranslation } from 'react-i18next';
import { getSocketInstance } from '../sockets/socketConfig';
import DriverMap from './DriverMap';
import UserMap from './userMap';
const socket = getSocketInstance()
const ActiveRidePage = () => {
  const { t } = useTranslation();
  const isDriverLogged = isDriver();
  const { updateCurrentDriverLocationDetails, getUserCoordinates } = useGetCurrentLocation();
  const { activeRequestInfo } = useSelector((state) => isDriverLogged ? state.driver : state.user);
  isDriverLogged ? useGetDriverActiveRequests() : useGetUserActiveRequests(500)
  const { screenHeight } = getScreen()
  useEffect(() => {
    if (isDriverLogged) {
      updateCurrentDriverLocationDetails()
    } else {
      getUserCoordinates()
    }
  }, [isDriverLogged])


  const detailsObj = {
    driver: {
      ...activeRequestInfo,
      details: {
        name: activeRequestInfo?.user_details?.name,
        phone: activeRequestInfo?.user_details?.phone,
        // id:   activeRequestInfo?.driver_details?.id,
      }
    },
    user: {
      ...activeRequestInfo,
      details: {
        name: activeRequestInfo?.driver_details?.name,
        phone: activeRequestInfo?.driver_details?.phone,
        id: activeRequestInfo?.driver_details?.id,
        vehicle: {
          ...activeRequestInfo?.driver_details?.vehicle
        }
      }
    }
  }

  useEffect(() => {
    console.log('activeRequestId', activeRequestInfo)
    if (socket && activeRequestInfo?.id) {
      console.log('activeRequestId', activeRequestInfo.id)
      socket?.emit(SOCKET_EVENTS.joinRoom, activeRequestInfo.id);  // Replace with the actual rideId
    }
  }, [activeRequestInfo?.id, socket])

  const requestInfo = isDriverLogged ? detailsObj.driver : detailsObj.user
  if (isEmpty(activeRequestInfo)) {
    return null;
  }
  return (
    <KeyboardAwareScrollView extraHeight={180} extraScrollHeight={-60} enableOnAndroid>
      <ContainerWrapper>
        <View style={{ height: (screenHeight - 345) }}>
          <View style={{ backgroundColor: COLORS.card_bg, padding: 15, paddingTop: 10, paddingBottom: 0, borderRadius: 12, margin: 15, zIndex: 10000 }}>
            <Timeline
              data={[activeRequestInfo?.from, activeRequestInfo?.to]}
              numberOfLines={1}
              textStyles={{ fontSize: 12 }}
            />
          </View>
          {isDriverLogged ? <DriverMap activeRequestInfo={activeRequestInfo} /> : <UserMap activeRequestInfo={activeRequestInfo} />}
        </View>
        <View style={[ActiveRidePageStyles.cardBottom, { backgroundColor: COLORS.white, padding: 15, paddingBottom: 3, borderTopLeftRadius: 18, borderTopRightRadius: 18 }]}>
          {/* {isDriverLogged ? <CardWrapper title={'User Details'}>
            <VehicleCard activeRequestInfo={activeRequestInfo} details={USER_INFORMATION} avatar={'user.avatar'} />
          </CardWrapper> :
            <CardWrapper title={'Vehicle Details'}>
              <VehicleCard activeRequestInfo={activeRequestInfo} details={VEHICLE_INFORMATION} avatar={'driver.vehicle.vehicle_image'} showOtp={true} />
            </CardWrapper>} */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text>{t('distance')}</Text>
            <Text>{requestInfo?.duration} {requestInfo?.distance ? `- ${requestInfo.distance} km` : ''}</Text>
          </View>
          {!isEmpty(activeRequestInfo) && <RideDetailsCards isDriverLogged={isDriverLogged} activeRequestInfo={requestInfo} />}

        </View>
      </ContainerWrapper>
    </KeyboardAwareScrollView>
  );
};

export default ActiveRidePage;
