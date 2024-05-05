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

const ActiveRidePage = () => {
  const isDriverLogged = isDriver();
  const { activeRequest, activeRideId } = useSelector((state) => isDriverLogged ? state.driver : state.user);
  const { screenHeight } = getScreen()

  return (
    <View style={[FindRideStyles.container]}>
      <View style={{ height: (screenHeight - 530) }}>
        {activeRequest?.id && <ActiveMapPage activeRequest={activeRequest} activeRideId={activeRideId} />}
      </View>
      <View style={[ActiveRidePageStyles.cardBottom, { backgroundColor: COLORS.bg_light, padding: 10, paddingBottom: 3 }]}>
        {(activeRideId && activeRequest?.from_location) && <OpenMapButton route={{ start: activeRequest.from_location, end: activeRequest.to_location, navigate: true }} />}
        {isDriverLogged ? <CardWrapper title={'User Details'}>
          <VehicleCard activeRequest={activeRequest} details={USER_INFORMATION} avatar={'user.avatar'} />
        </CardWrapper> :
          <CardWrapper title={'Vehicle Details'}>
            <VehicleCard activeRequest={activeRequest} details={VEHICLE_INFORMATION} avatar={'driver.vehicle.vehicle_image'} showOtp={true} />
          </CardWrapper>}
        <CardWrapper title={'Driver & Ride Details'}>
          {!isEmpty(activeRequest) && <RideDetailsCards isDriverLogged={isDriverLogged} activeRequest={activeRequest} />}
        </CardWrapper>
        <RideStatusDialog activeRequest={activeRequest} isDriverLogged={isDriverLogged} />
      </View>
    </View>
  );
};

export default ActiveRidePage;
