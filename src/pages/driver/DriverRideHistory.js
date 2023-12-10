import { useEffect } from "react";
import { useDriverRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"

export default () => {
    const { data: rideHistory, error: rideHistoryError, isLoading } = useDriverRideHistoryQuery({}, { refetchOnMountOrArgChange: true });

    if (isLoading) {
        return null
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
        <MyRidePage data={rideHistory} keys={rideHistoryKeys}/>
    )
}