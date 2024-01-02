import { useCallback, useEffect } from "react";
import { useLazyDriverRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import ActivityIndicator from "../../components/common/ActivityIndicator";
import { useFocusEffect } from '@react-navigation/native';

export default () => {
    const [refetch, { data: rideHistory, error: rideHistoryError, isLoading, refech }] = useLazyDriverRideHistoryQuery({}, { refetchOnMountOrArgChange: true });
    useFocusEffect(
        useCallback(() => {
            refetch?.()
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