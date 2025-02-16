import { useDispatch, useSelector } from "react-redux";
import { DriverAvailableStatus } from "../constants";
import { useLazyDriverActiveRideQuery, useLazyGetDriverWalletQuery } from "../slices/apiSlice";
import { useCallback, useEffect, useRef } from "react";
import { clearDriverState, setActiveRide, setDriverWallet, setRideRequest } from "../slices/driverSlice";
import { useFocusEffect } from "@react-navigation/native";
import { delay } from "lodash";
export default () => {
    const dispatch = useDispatch();
    const { driverInfo } = useSelector(state => state.auth);
    const { isOnline, activeRequestInfo } = useSelector(state => state.driver);
    const isOffline = isOnline === DriverAvailableStatus.OFFLINE;
    const [refetch, { data: activeDriverRideDetails, error: isDriverError }] = useLazyDriverActiveRideQuery({}, { skip: isOffline, refetchOnMountOrArgChange: true });
    const [refetchWallet, { data: wallet }] = useLazyGetDriverWalletQuery({ id: driverInfo?.id }, { skip: isOffline || driverInfo?.id, refetchOnMountOrArgChange: true });

    // const { getCurrentLocation } = useGetCurrentLocation();
 

    useFocusEffect(
        useCallback(() => {
            if (!isOffline) {
                // delay(() => {
                    // if(activeRequestInfo)
                    refetch?.()
                    refetchWallet({id: driverInfo?.id,})
                // }, 250)
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