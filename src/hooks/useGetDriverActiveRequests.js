import { useDispatch, useSelector } from "react-redux";
import { useDriverActiveRideMutation } from "../slices/apiSlice";
import { useCallback, useEffect } from "react";
import { clearDriverState, setActiveRide, setRideRequest } from "../slices/driverSlice";
import { useFocusEffect } from "@react-navigation/native";
import { _isDriverOffline } from "../util";
import useGetDriverWallet from "./useGetDriverWallet";
export default () => {
    const dispatch = useDispatch();
    const {driverInfo} = useSelector(state => state.auth );
    const isOffline  = _isDriverOffline();
    const [refetch, { data: activeDriverRideDetails, error: isDriverError }] = useDriverActiveRideMutation({}, { skip: isOffline, refetchOnMountOrArgChange: true });
    useGetDriverWallet(undefined, true)
    // const { getCurrentLocation } = useGetCurrentLocation();
    useFocusEffect(
        useCallback(() => {
            if (!isOffline) {
                refetch?.() // workaround to force refetch
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