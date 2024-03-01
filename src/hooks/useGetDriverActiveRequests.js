import { useDispatch, useSelector } from "react-redux";
import { DriverAvailableStatus } from "../constants";
import { useLazyDriverActiveRideQuery } from "../slices/apiSlice";
import { useCallback, useEffect, useRef } from "react";
import { clearDriverState, setActiveRide, setRideRequest } from "../slices/driverSlice";
import { useFocusEffect } from "@react-navigation/native";
export default () => {
    const dispatch = useDispatch()
    const { isOnline } = useSelector(state => state.driver);
    const isOffline = isOnline === DriverAvailableStatus.OFFLINE;
    const [refetch, { data: activeDriverRideDetails, error: isDriverError }] = useLazyDriverActiveRideQuery({}, {skip: isOffline, refetchOnMountOrArgChange: true });

    useFocusEffect(
        useCallback(() => {
            if(!isOffline) {
                refetch?.()
            }
        },[])
    );

    useEffect(() => {
        if (isDriverError) {
            dispatch(clearDriverState())
        } else if (activeDriverRideDetails || activeDriverRideDetails === null) {
            if (Array.isArray(activeDriverRideDetails)) {
                dispatch(setRideRequest(activeDriverRideDetails));
            } else {
                dispatch(setActiveRide(activeDriverRideDetails))
            }
        }
    }, [activeDriverRideDetails, isDriverError])


    return activeDriverRideDetails
}