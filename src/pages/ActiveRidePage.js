import React from 'react';
import { View, Pressable } from 'react-native';
import { get } from 'lodash';
import { Text } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import { ImageView, Icon } from '../components/common';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import { COLORS, USER_INFORMATION, VEHICLE_INFORMATION } from '../constants';
import ActiveRidePageStyles from '../styles/ActiveRidePageStyles';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getScreen, getVehicleImage, isDriver } from '../util';
import ActiveMapPage from './ActiveMap';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import RideStatusDialog from '../components/common/RideStatusDialog';
import RideDetailsCards from '../components/common/RideDetailsCards';
import OpenMapButton from '../components/common/OpenMapButton';

const VehicleCard = ({ activeRequest, details, avatar, showOtp = false }) => {
  const avatarUri = get(activeRequest, avatar, null);
  const vehicleImage = get(activeRequest, 'driver.vehicle.type_vehicle_type.code', null);
  const defaultImage = showOtp ? images['captain0'] : getVehicleImage(vehicleImage)

  return (
    <View style={FindRideStyles.card}>
      <View style={{ padding: 10 }}>
        <View style={FindRideStyles.cardtop}>
          <View style={FindRideStyles.left}>
            <ImageView
              source={avatarUri ? { uri: avatarUri } : defaultImage
              }
              style={[styles.avatar]}
            />
          </View>
          <View style={FindRideStyles.middle}>
            {details.map((item) => {
              const value = Array.isArray(item.key) ? item.key.map(key => get(activeRequest, key, 'NA')).join(' | ') : get(activeRequest, item.key, null)
              return <Text key={item.key} style={[FindRideStyles.name, item.props?.style]}>{value}</Text>
            })}
          </View>
          <View style={[FindRideStyles.right, { justifyContent: 'center', alignItems: 'center' }]}>
            {showOtp && <Text style={[FindRideStyles.name, { alignSelf: 'center', fontWeight: 'bold', color: COLORS.brand_blue }]}>
              OTP: {activeRequest.code}
            </Text>}
            <Pressable onPress={() => RNImmediatePhoneCall.immediatePhoneCall('08071175144')} style={{ backgroundColor: COLORS.green, borderRadius: 20, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="phone" size="large" color={COLORS.white} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const ActiveRidePage = () => {
  const isDriverLogged = isDriver();
  const { activeRequest, activeRideId } = useSelector((state) => isDriverLogged ? state.driver : state.user);

  const Cards = ({ title, children }) => {
    return <View>
      <Text style={[styles.name, styles.blackColor, styles.bold]}>
        {title}:
      </Text>
      {children}
    </View>
  }
  const { screenHeight } = getScreen()

  return (
    <View style={[FindRideStyles.container]}>
      <View style={{ height: (screenHeight - 530) }}>
        {activeRequest?.id && <ActiveMapPage activeRequest={activeRequest} activeRideId={activeRideId} />}
      </View>
      <View style={[ActiveRidePageStyles.cardBottom, { backgroundColor: COLORS.bg_light, padding: 10, paddingBottom: 3 }]}>
        {(activeRideId && activeRequest?.from_location) && <OpenMapButton route={{ start: activeRequest.from_location, end: activeRequest.to_location, navigate: true }} />}
        {isDriverLogged ? <Cards title={'User Details'}>
          <VehicleCard activeRequest={activeRequest} details={USER_INFORMATION} avatar={'user.avatar'} />
        </Cards> :
          <Cards title={'Vehicle Details'}>
            <VehicleCard activeRequest={activeRequest} details={VEHICLE_INFORMATION} avatar={'driver.vehicle.vehicle_image'} showOtp={true} />
          </Cards>}
        <Cards title={'Driver & Ride Details'}>
          {!isEmpty(activeRequest) && <RideDetailsCards isDriverLogged={isDriverLogged} activeRequest={activeRequest} />}
        </Cards>
        <RideStatusDialog activeRequest={activeRequest} isDriverLogged={isDriverLogged} />
      </View>
    </View>
  );
};

export default ActiveRidePage;
