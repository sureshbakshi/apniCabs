import { useDispatch, useSelector } from "react-redux"
import { useGetDriverDetailsMutation, useLazyGetDriverDetailsQuery, useUpdateDriverStatusMutation } from "../slices/apiSlice"
import { setDriverDetails } from "../slices/authSlice"
import { useEffect } from "react"
import { isEmpty } from 'lodash'
import { setDriverStatus } from "../slices/driverSlice"
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
    const { getCurrentLocation } = useGetCurrentLocation();
    const [_updateDriverStatus] = useUpdateDriverStatusMutation();
    const dispatch = useDispatch();

    const updateDriverStatus = async (isOnline, cb) => {
        const { latitude, longitude } = await getCurrentLocation(null, true) || {};
        if ((!latitude || !longitude) && isOnline) {
            return;
        }
        _updateDriverStatus({ is_available: isOnline ? 1 : 0, }).unwrap().then((res) => {
            dispatch(setDriverStatus({ is_available: isOnline ? DriverAvailableStatus.ONLINE : DriverAvailableStatus.OFFLINE }))
        }).catch(() => cb?.(!isOnline))
    }
    return updateDriverStatus
}