import { useDispatch } from "react-redux";
import { useLazyUserActiveRideQuery } from "../slices/apiSlice";
import { useCallback, useEffect, useRef } from "react";
import { clearUserState, setActiveRequest, setActiveRideRequest } from "../slices/userSlice";
import { useFocusEffect } from "@react-navigation/native";
import useGetCurrentLocation from "./useGetCurrentLocation";

// pickaride, search ride - always
//active page = active ride & drive, active page + user
export default () => {
    const dispatch = useDispatch()
    const [refetch, { data: activeUserRideDetails, error: isUserError }] = useLazyUserActiveRideQuery({}, { refetchOnMountOrArgChange: true });
    // const { getCurrentLocation } = useGetCurrentLocation();

    useFocusEffect(
        useCallback(() => {
            refetch?.('1')
            // getCurrentLocation()
        }, [])
    );


    useEffect(() => {
        if (isUserError) {
            dispatch(clearUserState())
        } else if(activeUserRideDetails?.id && activeUserRideDetails?.driver_details === null){
            dispatch(setActiveRequest(activeUserRideDetails))
        } else if (activeUserRideDetails) {
            dispatch(setActiveRideRequest(activeUserRideDetails))
        }
    }, [activeUserRideDetails, isUserError])

    return activeUserRideDetails
}