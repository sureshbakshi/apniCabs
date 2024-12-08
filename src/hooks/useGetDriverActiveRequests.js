import { useDispatch, useSelector } from "react-redux";
import { DriverAvailableStatus } from "../constants";
import { useLazyDriverActiveRideQuery, useLazyGetDriverWalletQuery } from "../slices/apiSlice";
import { useCallback, useEffect, useRef } from "react";
import { clearDriverState, setActiveRide, setDriverWallet, setRideRequest } from "../slices/driverSlice";
import { useFocusEffect } from "@react-navigation/native";
import useGetCurrentLocation from "./useGetCurrentLocation";
export default () => {
    const dispatch = useDispatch()
    const { isOnline } = useSelector(state => state.driver);
    const isOffline = isOnline === DriverAvailableStatus.OFFLINE;
    const [refetch, { data: activeDriverRideDetails, error: isDriverError }] = useLazyDriverActiveRideQuery({}, {skip: isOffline, refetchOnMountOrArgChange: true });
    const [refetchWallet, { data: wallet }] = useLazyGetDriverWalletQuery({}, {skip: isOffline, refetchOnMountOrArgChange: true });

    // const { getCurrentLocation } = useGetCurrentLocation();

    useFocusEffect(
        useCallback(() => {
            if(!isOffline) {
                refetch?.('1')
                refetchWallet?.('1')
                // getCurrentLocation()
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

        if(wallet) {
            dispatch(setDriverWallet(wallet))
        }
    }, [activeDriverRideDetails, isDriverError, wallet])


    return activeDriverRideDetails
}