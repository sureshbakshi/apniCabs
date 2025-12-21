import { useDispatch } from "react-redux";
import { useLazyUserActiveRideQuery } from "../slices/apiSlice";
import { useCallback, useEffect } from "react";
import { setActiveRequest } from "../slices/userSlice";
import { useFocusEffect } from "@react-navigation/native";

// pickaride, search ride - always
//active page = active ride & drive, active page + user
export default (delay = 0) => {
    const dispatch = useDispatch()
    const [refetch, { data: activeUserRideDetails, error: isUserError }] = useLazyUserActiveRideQuery({}, { refetchOnMountOrArgChange: true, });

    const delayedRefetch = useCallback(async (params = {}) => {
        await new Promise(resolve => setTimeout(resolve, delay)); // 500ms delay
        return await refetch(params).unwrap();
    }, [refetch]);

    useFocusEffect(
        useCallback(() => {
            delayedRefetch?.({}, false)
        }, [])
    );


    useEffect(() => {
        if (isUserError) {
            dispatch(setActiveRequest())
        } else if (activeUserRideDetails) {
            dispatch(setActiveRequest(activeUserRideDetails))
        }
    }, [activeUserRideDetails, isUserError])

}