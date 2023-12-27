import { useCallback, useEffect } from "react";
import { useDriverRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import ActivityIndicator from "../../components/common/ActivityIndicator";
import { useFocusEffect } from '@react-navigation/native';

export default () => {
    const { data: rideHistory, error: rideHistoryError, isLoading, refech } = useDriverRideHistoryQuery({}, { refetchOnMountOrArgChange: true });
    useFocusEffect(
        useCallback(() => {
            console.log("Function Call on TAb change", refech)
            refech?.()
        }, [])
    );
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
    if (isLoading) {
        return <ActivityIndicator />
    }
    return (
        <MyRidePage data={rideHistory} keys={rideHistoryKeys} />
    )
}