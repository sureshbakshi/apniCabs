import { useEffect } from "react";
import { useUserRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"

export default () => {
    const { data: rideHistory, error: rideHistoryError, isLoading } = useUserRideHistoryQuery({}, { refetchOnMountOrArgChange: true });

    if (isLoading) {
        return null
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