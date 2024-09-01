import { useCallback, useEffect } from "react";
import { useLazyDriverRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import ActivityIndicator from "../../components/common/ActivityIndicator";
import { useFocusEffect } from '@react-navigation/native';

export default () => {
    const [refetch, { data: rideHistory, error: rideHistoryError, isLoading, isFetching, isUninitialized }] = useLazyDriverRideHistoryQuery({}, { refetchOnMountOrArgChange: true });
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
        rideTime: 'ride.start_time',
        avatar: '',
        fare: 'ride.fare'
    }
    if (isLoading || isUninitialized) {
        return <ActivityIndicator />
    }

    return (
        <MyRidePage data={rideHistory} keys={rideHistoryKeys} />
    )
}