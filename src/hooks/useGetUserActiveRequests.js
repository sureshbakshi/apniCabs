import { useDispatch } from "react-redux";
import { useLazyUserActiveRideQuery } from "../slices/apiSlice";
import { useCallback, useEffect, useRef } from "react";
import { clearUserState, setActiveRequest } from "../slices/userSlice";
import { useFocusEffect } from "@react-navigation/native";

// pickaride, search ride - always
//active page = active ride & drive, active page + user
export default () => {
    const dispatch = useDispatch()
    const [refetch, { data: activeUserRideDetails, error: isUserError }] = useLazyUserActiveRideQuery({}, { refetchOnMountOrArgChange: true });

    useFocusEffect(
        useCallback(() => {
            refetch?.('1') 
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