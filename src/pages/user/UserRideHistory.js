import { useCallback, useEffect } from "react";
import { useLazyUserRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import ActivityIndicator from "../../components/common/ActivityIndicator";
import { useFocusEffect } from "@react-navigation/native";

export default () => {
    const [refetch, { data: rideHistory, error: rideHistoryError, isLoading }] = useLazyUserRideHistoryQuery({}, { refetchOnMountOrArgChange: true });
    useFocusEffect(
        useCallback(() => {
            refetch?.()
        }, [])
    );
    if (isLoading) {
        return  <ActivityIndicator/>
    }

    const rideHistoryKeys = {
        name: '',
        status: 'status',
        from: 'from_location',
        to: 'to_location',
        model: '',
        rideTime: 'updated_at',
        avatar: '',
        fare: 'ride.fare'
      }
      
    return (
       <MyRidePage data={rideHistory} keys={rideHistoryKeys}/>
    )
}