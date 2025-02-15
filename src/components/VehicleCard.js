import { Pressable, View } from "react-native"
import { Text } from "react-native-paper"
import styles from '../styles/MyProfilePageStyles';
import images from "../util/images";
import FindRideStyles from "../styles/FindRidePageStyles";
import { Icon, ImageView } from "./common";
import { COLORS, RideProxyNumber } from "../constants";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { get } from 'lodash';
import { getVehicleImage } from "../util";

export default ({ activeRequestInfo, details, avatar, showOtp = false, isonRide = true, vehicleImageUri }) => {
  const avatarUri = get(activeRequestInfo, avatar, null);
  const vehicleImage = get(activeRequestInfo, 'driver.vehicle.type_vehicle_type.code', null);
  const defaultImage = showOtp ? images['captain0'] : getVehicleImage(vehicleImage)
  const getValue = (activeRequestInfo, item) => {
    let value = get(activeRequestInfo, item?.key, null)
    if (item?.formatter) {
      return item?.formatter(value)
    }
    return value
  }
  return (
    <View style={FindRideStyles.card}>
      <View style={{ padding: 10 }}>
        <View style={FindRideStyles.cardtop}>
          <View style={FindRideStyles.left}>
            <ImageView
              source={avatarUri ? { uri: avatarUri } : vehicleImageUri || defaultImage
              }
              style={[styles.avatar]}
            />
          </View>
          <View style={FindRideStyles.middle}>
            {details.map((item) => {
              const value = Array.isArray(item.key) ? item.key.map(key => get(activeRequestInfo, key, 'NA')).join(' | ') : getValue(activeRequestInfo, item)
              if (value) {
                return <Text key={item.key} style={[FindRideStyles.name, item.props?.style]}>{value}</Text>
              }
              return null
            })}
          </View>
          {isonRide && <View style={[FindRideStyles.right, { justifyContent: 'center', alignItems: 'center' }]}>
            {showOtp && <Text style={[FindRideStyles.name, { alignSelf: 'center', fontWeight: 'bold', color: COLORS.brand_blue }]}>
              OTP: {activeRequestInfo.code}
            </Text>}
            <Pressable onPress={() => RNImmediatePhoneCall.immediatePhoneCall(RideProxyNumber)} style={{ backgroundColor: COLORS.green, borderRadius: 20, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="phone" size="large" color={COLORS.white} />
            </Pressable>
          </View>}
        </View>
      </View>
    </View>
  );
};