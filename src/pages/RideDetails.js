import React from 'react';
import { View } from 'react-native';
import { COLORS} from '../constants';
import { RideDetailsView } from '../components/common/RideDetailsCards';
import FindRideStyles from '../styles/FindRidePageStyles';
import { useGetRideDetailsQuery } from '../slices/apiSlice';
import ActivityIndicator from '../components/common/ActivityIndicator';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { Text } from '../components/common';


export default ({ route }) => {
    const id = route.params?.id
    const { data: rideDetails, isLoading } = useGetRideDetailsQuery(id);
    if (isLoading) {
        return <ActivityIndicator />
    }

    const activeRequestInfo = {
        ...rideDetails,
        details: rideDetails?.RequestRides?.driver_details
    }
    return (
        <ContainerWrapper style={{ paddingHorizontal: 10 }}>
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
