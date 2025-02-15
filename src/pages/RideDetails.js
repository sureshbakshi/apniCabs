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
    return (
        <SafeAreaView style={styles.container}>
            <View style={[FindRideStyles.pageContainer]}>
            <View style={[FindRideStyles.container]}>
                <ContainerWrapper>
                    {/* <View style={[FindRideStyles.card, { backgroundColor: COLORS.white, borderRadius: 24, padding: 15 }]}>
                        <Text style={{ fontSize: 14, fontWeight: 700, lineHeight: 18, marginBottom: 10 }}>User Details</Text>
                        <AvatarInfo dp={avatar} name={name} avatarContainerStyles={{alignItems: 'center'}}/>
                    </View> */}
                    <View style={[FindRideStyles.card, { backgroundColor: COLORS.white, borderRadius: 24, padding: 15 }]}>
                        <Text style={{ fontSize: 14, fontWeight: 700, lineHeight: 18, marginBottom: 10 }}>Ride Details</Text>
                        <RideDetailsView activeRequestInfo={rideDetails} driverDetails={rideDetails?.RequestRides?.driver_details} isOnRide={false} containerStyles={{ padding: 0 }} avatarContainerStyles={{ paddingHorizontal: 0 }} />
                    </View>
                </ContainerWrapper>
            </View>
            {/* <View style={{ margin: 10 }}>
                <CardWrapper title={'USER DETAILS'}>
                    <VehicleCard activeRequestInfo={rideDetails} details={USER_DETAILS} isonRide={false} avatar={'userDetails.avatar'} />
                </CardWrapper>
                {rideDetails?.request.ride ? <CardWrapper title={'VEHICLE DETAILS'}>
                    <VehicleCard activeRequestInfo={rideDetails} details={RIDE_HISTOY_DETAILS} isonRide={false} vehicleImageUri={type} />
                </CardWrapper> : <CardWrapper title={'REASON'}>
                    <VehicleCard activeRequestInfo={rideDetails} details={RIDE_CANCEL_INFO} isonRide={false} vehicleImageUri={type} />
                </CardWrapper>}
                {rideDetails?.request && <CardWrapper title={'RIDE DETAILS'}>
                    <View style={FindRideStyles.card}>
                        <RideDetailsView activeRequestInfo={rideDetails.request} driverDetails={rideDetails?.request.ride?.driver} />
                        <CustomButton label={'Need help? Call Us!'} isLowerCase={true} onClick={() => RNImmediatePhoneCall?.immediatePhoneCall(SUPPORT.mobile.value)} />
                    </View>
                </CardWrapper>}
            </View> */}
            </View>
        </SafeAreaView>
    );
};
