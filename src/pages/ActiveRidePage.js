import React, { useEffect } from 'react';
import { View } from 'react-native';
import FindRideStyles from '../styles/FindRidePageStyles';
import { COLORS } from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getScreen, isDriver } from '../util';
import ActiveMapPage from './ActiveMap';
import RideStatusDialog from '../components/common/RideStatusDialog';
import RideDetailsCards from '../components/common/RideDetailsCards';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { Text } from '../components/common';
import Timeline from '../components/common/timeline/Timeline';
import { SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useGetDriverActiveRequests from '../hooks/useGetDriverActiveRequests';
import useGetUserActiveRequests from '../hooks/useGetUserActiveRequests';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';

const ActiveRidePage = () => {
  const isDriverLogged = isDriver();
  const { getCurrentLocation } = useGetCurrentLocation();
  const { activeRequestInfo } = useSelector((state) => isDriverLogged ? state.driver : state.user);
  if (!activeRequestInfo?.driver) {
    isDriverLogged ? useGetDriverActiveRequests() : useGetUserActiveRequests()
  }
  const { screenHeight } = getScreen()
  useEffect(() => {
    getCurrentLocation()
  },[])
  

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
        id:   activeRequestInfo?.driver_details?.id,
        vehicle: {
          ...activeRequestInfo?.driver_details?.vehicle
        }
      }
    }
  }

  const requestInfo = isDriverLogged ? detailsObj.driver : detailsObj.user
  return (
    <SafeAreaView style={[FindRideStyles.container]}>
      <KeyboardAwareScrollView extraHeight={180} extraScrollHeight={-60} enableOnAndroid>
        <ContainerWrapper style={{ height: isDriverLogged ? screenHeight - 160 : screenHeight - 160 }}>
          <View style={{ height: (screenHeight - 345) }}>
            <View style={{ backgroundColor: COLORS.card_bg, padding: 15, paddingTop: 10, paddingBottom: 0, borderRadius: 12, margin: 15, zIndex: 10000 }}>
              <Timeline
                data={[activeRequestInfo.from, activeRequestInfo.to]}
                numberOfLines={1}
                textStyles={{ fontSize: 12 }}
              />
            </View>
            <ActiveMapPage activeRequestInfo={activeRequestInfo} />
          </View>
          <View style={[ActiveRidePageStyles.cardBottom, { backgroundColor: COLORS.white, padding: 15, paddingBottom: 3, borderTopLeftRadius: 18, borderTopRightRadius: 18 }]}>
            {/* {isDriverLogged ? <CardWrapper title={'User Details'}>
            <VehicleCard activeRequestInfo={activeRequestInfo} details={USER_INFORMATION} avatar={'user.avatar'} />
          </CardWrapper> :
            <CardWrapper title={'Vehicle Details'}>
              <VehicleCard activeRequestInfo={activeRequestInfo} details={VEHICLE_INFORMATION} avatar={'driver.vehicle.vehicle_image'} showOtp={true} />
            </CardWrapper>} */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text>Distance</Text>
              <Text>{requestInfo?.duration} {requestInfo?.distance ?`- ${requestInfo.distance} km`: ''}</Text>
            </View>
            {!isEmpty(activeRequestInfo) && <RideDetailsCards isDriverLogged={isDriverLogged} activeRequestInfo={requestInfo} />}

            <RideStatusDialog activeRequestInfo={activeRequestInfo} isDriverLogged={isDriverLogged} />
          </View>
        </ContainerWrapper>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ActiveRidePage;
