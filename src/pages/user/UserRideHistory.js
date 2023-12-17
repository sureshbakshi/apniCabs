import { useEffect } from "react";
import { useUserRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import ActivityIndicator from "../../components/common/ActivityIndicator";

export default () => {
    const { data: rideHistory, error: rideHistoryError, isLoading } = useUserRideHistoryQuery({}, { refetchOnMountOrArgChange: true });

    if (true) {
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
       rideHistory.length && <MyRidePage data={rideHistory} keys={rideHistoryKeys}/>
    )
}