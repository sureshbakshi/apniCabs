import { useDispatch, useSelector } from "react-redux";
import { DriverAvailableStatus } from "../constants";
import { useLazyDriverActiveRideQuery, useLazyGetDriverWalletQuery } from "../slices/apiSlice";
import { useCallback, useEffect, useRef } from "react";
import { clearDriverState, setActiveRide, setDriverWallet, setRideRequest } from "../slices/driverSlice";
import { useFocusEffect } from "@react-navigation/native";
import useGetCurrentLocation from "./useGetCurrentLocation";
export default () => {
    const dispatch = useDispatch();
    const { driverInfo } = useSelector(state => state.auth);
    const { isOnline } = useSelector(state => state.driver);
    const isOffline = isOnline === DriverAvailableStatus.OFFLINE;
    const [refetch, { data: activeDriverRideDetails, error: isDriverError }] = useLazyDriverActiveRideQuery({}, { skip: isOffline, refetchOnMountOrArgChange: true });
    const [refetchWallet, { data: wallet }] = useLazyGetDriverWalletQuery({ id: driverInfo?.id }, { skip: isOffline, refetchOnMountOrArgChange: true });

    // const { getCurrentLocation } = useGetCurrentLocation();
 

    useFocusEffect(
        useCallback(() => {
            if (!isOffline) {
                refetch?.('1')
                refetchWallet({id: driverInfo?.id,})
                // getCurrentLocation()
            }
        }, [])
    );

    useEffect(() => {
        if (isDriverError) {
            dispatch(clearDriverState())
        } else if (activeDriverRideDetails || activeDriverRideDetails === null) {
            if (Array.isArray(activeDriverRideDetails)) {
                dispatch(setRideRequest(activeDriverRideDetails));
                dispatch(setActiveRide({}))
            } else {
                dispatch(setActiveRide(activeDriverRideDetails))
                dispatch(setRideRequest({}));

            }
        }

        if (wallet) {
            dispatch(setDriverWallet(wallet))
        }
    }, [activeDriverRideDetails, isDriverError, wallet])


    return activeDriverRideDetails
}