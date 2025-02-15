import { useDispatch } from "react-redux";
import { useLazyUserActiveRideQuery } from "../slices/apiSlice";
import { useCallback, useEffect, useRef } from "react";
import { clearUserState, setActiveRequest, setActiveRideRequest } from "../slices/userSlice";
import { useFocusEffect } from "@react-navigation/native";
import useGetCurrentLocation from "./useGetCurrentLocation";
import { isEmpty } from 'lodash';
import { RideStatus } from "../constants";

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
        } else if (activeUserRideDetails) {
            dispatch(setActiveRequest(activeUserRideDetails))
        }
    }, [activeUserRideDetails, isUserError])

    return activeUserRideDetails
}