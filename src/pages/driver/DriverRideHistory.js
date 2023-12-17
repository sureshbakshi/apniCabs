import { useEffect } from "react";
import { useDriverRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import { COLORS } from "../../constants";
import { View } from "react-native";
import ActivityIndicator from "../../components/common/ActivityIndicator";

export default () => {
    const { data: rideHistory, error: rideHistoryError, isLoading } = useDriverRideHistoryQuery({}, { refetchOnMountOrArgChange: true });

    if (isLoading) {
        return <ActivityIndicator/>
    }

    const rideHistoryKeys = {
        name: '',
        status: 'status',
        from: 'from_location',
        to: 'to_location',
        model: '',
        rideTime: 'driver_requests.updated_at',
        avatar: '',
        fare: 'fare'
    }
    return (
        <MyRidePage data={rideHistory} keys={rideHistoryKeys} />
    )
}