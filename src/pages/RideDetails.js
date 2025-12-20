import React, { useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import styles from '../styles/MyRidePageStyles';
import { COLORS, RIDE_CANCEL_INFO, RIDE_HISTOY_DETAILS, SUPPORT, USER_DETAILS } from '../constants';
import { getVehicleImageById } from '../util';
import VehicleCard from '../components/VehicleCard';
import CardWrapper from '../components/CardWrapper';
import { AvatarInfo, RideDetailsView } from '../components/common/RideDetailsCards';
import FindRideStyles from '../styles/FindRidePageStyles';
import CustomButton from '../components/common/CustomButton';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { useGetRideDetailsQuery } from '../slices/apiSlice';
import ActivityIndicator from '../components/common/ActivityIndicator';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { ImageView, Text } from '../components/common';
import images from '../util/images';
import CommonStyles from '../styles/commonStyles';


export default ({ route }) => {
    // let type = null
    const id = route.params?.id
    const { data: rideDetails, isLoading } = useGetRideDetailsQuery(id);
    // useEffect(() => {
    //     if (id) {
    //         type = getVehicleImageById(rideDetails?.request?.ride?.driver.vehicle.type)
    //     }
    // }, [rideDetails])

    if (isLoading) {
        return <ActivityIndicator />
    }

    const activeRequestInfo = {
        ...rideDetails,
        details: rideDetails?.RequestRides?.driver_details
    }
    return (
        <ContainerWrapper>
            {/* <View style={[FindRideStyles.card, { backgroundColor: COLORS.white, borderRadius: 24, padding: 15 }]}>
                        <Text style={{ fontSize: 14, fontWeight: 700, lineHeight: 18, marginBottom: 10 }}>User Details</Text>
                        <AvatarInfo dp={avatar} name={name} avatarContainerStyles={{alignItems: 'center'}}/>
                    </View> */}
            <View style={[FindRideStyles.card, { backgroundColor: COLORS.white, borderRadius: 24, padding: 15 }]}>
                <Text style={{ fontSize: 14, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>Ride Details</Text>
                <RideDetailsView isRideHistory={true} activeRequestInfo={activeRequestInfo} driverDetails={rideDetails?.RequestRides?.driver_details} containerStyles={{ padding: 0 }} avatarContainerStyles={{ paddingHorizontal: 0 }} />
            </View>
        </ContainerWrapper>
    );
};
