import { useDispatch, useSelector } from "react-redux";
import { DriverAvailableStatus } from "../constants";
import { useDriverActiveRideQuery } from "../slices/apiSlice";
import { useEffect } from "react";
import { updateRideRequest } from "../slices/driverSlice";

export default () => {
    const dispatch = useDispatch()
    const { isOnline } = useSelector(state => state.driver);
    const status = isOnline !== DriverAvailableStatus.OFFLINE
    const { data: activeRideDetails } = useDriverActiveRideQuery(undefined, { skip: !status, refetchOnMountOrArgChange: true });
    useEffect(() => {
        if (activeRideDetails) {
            dispatch(updateRideRequest(activeRideDetails))
        }
    }, [activeRideDetails])
    return {
        status, activeRideDetails
    }
}