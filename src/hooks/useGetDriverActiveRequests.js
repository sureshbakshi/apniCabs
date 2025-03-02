import { useDispatch, useSelector } from "react-redux";
import { DriverAvailableStatus } from "../constants";
import { useDriverActiveRideMutation, useLazyGetDriverWalletQuery } from "../slices/apiSlice";
import { useCallback, useEffect, useRef } from "react";
import { clearDriverState, setActiveRide, setDriverWallet, setRideRequest } from "../slices/driverSlice";
import { useFocusEffect } from "@react-navigation/native";
import { delay } from "lodash";
import { _isDriverOffline } from "../util";
import useGetDriverWallet from "./useGetDriverWallet";
export default () => {
    const dispatch = useDispatch();
    const driverInfo = useSelector(state => state.auth.driverInfo );
    const isOffline  = _isDriverOffline();
    const [refetch, { data: activeDriverRideDetails, error: isDriverError }] = useDriverActiveRideMutation({}, { skip: isOffline, refetchOnMountOrArgChange: true });
    const fetchWallet = useGetDriverWallet(undefined, true)
    // const { getCurrentLocation } = useGetCurrentLocation();
 
    useFocusEffect(
        useCallback(() => {
            if (!isOffline) {
                // delay(() => {
                    // if(activeRequestInfo)
                if(driverInfo?.id){
                    console.log("refetchWallet")
                    refetch?.(Math.random()) // workaround to force refetch
                    fetchWallet()
                }
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
    }, [activeDriverRideDetails, isDriverError])
}