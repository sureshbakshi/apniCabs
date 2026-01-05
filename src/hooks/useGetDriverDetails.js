import { useDispatch, useSelector } from "react-redux"
import { useGetDriverDetailsMutation, useUpdateDriverStatusMutation } from "../slices/apiSlice"
import { setDriverDetails } from "../slices/authSlice"
import { useCallback, useEffect } from "react"
import isEmpty from 'lodash/isEmpty';
import { setDriverStatus, setServiceUnavailable } from "../slices/driverSlice"
import { DriverAvailableStatus } from "../constants"
import { isDriver, isOwner } from "../util"
import useGetCurrentLocation from "./useGetCurrentLocation"

export const useDisptachDriverDetails = (details) => {
    const dispatch = useDispatch()
    useEffect(() => {
        if (!isEmpty(details)) {
            dispatch(setDriverDetails(details))
            // dispatch(setDriverStatus(details))
        }
    }, [details])
}


export default useGetDriverDetails = (options, isCb = false) => {
    const isDriverLogged = isDriver() || isOwner()
    const { driverInfo, userInfo } = useSelector(state => state.auth);
    const id = driverInfo?.id || userInfo?.id
    if (id) {
        const [refetch, { data: driverDetails }] = useGetDriverDetailsMutation({ id }, { skip: !id || !isDriverLogged, ...options })
        const fetchDetails = () => {
            if (id && isDriverLogged) {
                refetch({ id })
            }
        }
        useEffect(() => {
            fetchDetails()
        }, [id, isDriverLogged])
        useDisptachDriverDetails(driverDetails)
        if (isCb) {
            return { fetchDetails }
        }
    }

}

export const useUpdateDriverStatus = () => {
    const { getDriverCoordinates } = useGetCurrentLocation();
    const [_updateDriverStatus] = useUpdateDriverStatusMutation();
    const dispatch = useDispatch();

    const updateDriverStatus = useCallback(async (isOnline, cb) => {
        const { latitude, longitude } = await getDriverCoordinates() || {};
        if ((!latitude || !longitude) && isOnline) {
            return false;
        }
        try {
            await _updateDriverStatus({
                is_available: isOnline ? 1 : 0,
                latitude,
                longitude
            }).unwrap();

            dispatch(setServiceUnavailable(false));
            dispatch(setDriverStatus({
                is_available: isOnline ? DriverAvailableStatus.ONLINE : DriverAvailableStatus.OFFLINE
            }));
            cb?.(isOnline); // Success callback
            return true;
        } catch (err) {
            cb?.(!isOnline); // Revert on error
            if (err?.status === 404) {
                dispatch(setServiceUnavailable(true));
            }
            return false;
        }
    }, [_updateDriverStatus, dispatch, getDriverCoordinates]);

    return updateDriverStatus;
};
