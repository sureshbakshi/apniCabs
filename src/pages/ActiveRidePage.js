import React from 'react';
import { View } from 'react-native';
import FindRideStyles from '../styles/FindRidePageStyles';
import { COLORS, USER_INFORMATION, VEHICLE_INFORMATION } from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getScreen, isDriver } from '../util';
import ActiveMapPage from './ActiveMap';
import RideStatusDialog from '../components/common/RideStatusDialog';
import RideDetailsCards from '../components/common/RideDetailsCards';
import OpenMapButton from '../components/common/OpenMapButton';
import VehicleCard from '../components/VehicleCard';
import CardWrapper from '../components/CardWrapper';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { Text } from '../components/common';
import Timeline from '../components/common/timeline/Timeline';
import { SafeAreaView } from 'react-native';

const ActiveRidePage = () => {
  const isDriverLogged = isDriver();
  const { activeRequest, activeRideId } = useSelector((state) => isDriverLogged ? state.driver : state.user);
  const { screenHeight } = getScreen()
  return (
    <SafeAreaView style={[FindRideStyles.container]}>
      <ContainerWrapper style={{ height: isDriverLogged ? screenHeight - 150 : screenHeight - 150 }}>
        <View style={{ height: (screenHeight - 345) }}>
          <View style={{ backgroundColor: COLORS.card_bg, padding: 15, paddingTop: 10, paddingBottom: 0, borderRadius: 12, margin: 15, zIndex: 10000 }}>
            <Timeline
              data={[activeRequest.from_location, activeRequest.to_location]}
              numberOfLines={1}
              textStyles={{fontSize: 12}}
            />
          </View>
          {activeRequest?.id && <ActiveMapPage activeRequest={activeRequest} activeRideId={activeRideId} />}
        </View>
        <View style={[ActiveRidePageStyles.cardBottom, { backgroundColor: COLORS.white, padding:15, paddingBottom: 3, borderTopLeftRadius: 18, borderTopRightRadius: 18 }]}>
          {/* {isDriverLogged ? <CardWrapper title={'User Details'}>
            <VehicleCard activeRequest={activeRequest} details={USER_INFORMATION} avatar={'user.avatar'} />
          </CardWrapper> :
            <CardWrapper title={'Vehicle Details'}>
              <VehicleCard activeRequest={activeRequest} details={VEHICLE_INFORMATION} avatar={'driver.vehicle.vehicle_image'} showOtp={true} />
            </CardWrapper>} */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' , marginBottom: 10}}>
            <Text>Distance</Text>
            <Text>{activeRequest.duration} - {activeRequest.distance} km</Text>
          </View>
          {!isEmpty(activeRequest) && <RideDetailsCards isDriverLogged={isDriverLogged} activeRequest={activeRequest} />}
          
          <RideStatusDialog activeRequest={activeRequest} isDriverLogged={isDriverLogged} />
        </View>
      </ContainerWrapper>
    </SafeAreaView>
  );
};

export default ActiveRidePage;
