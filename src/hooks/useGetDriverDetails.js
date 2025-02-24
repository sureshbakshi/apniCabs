import { useDispatch } from "react-redux"
import { useLazyGetDriverDetailsQuery, useUpdateDriverStatusMutation } from "../slices/apiSlice"
import { setDriverDetails } from "../slices/authSlice"
import { useEffect } from "react"
import { isEmpty } from 'lodash'
import { setDriverStatus } from "../slices/driverSlice"
import { DriverAvailableStatus } from "../constants"
import { isDriver } from "../util"

export const useDisptachDriverDetails = (details) => {
    const dispatch = useDispatch()
    useEffect(() => {
        if (!isEmpty(details)) {
            dispatch(setDriverDetails(details))
            dispatch(setDriverStatus(details))
        }
    }, [details])
}


export default useGetDriverDetails = (id, options) => {
    const isDriverLogged = isDriver()
    console.log(isDriverLogged)
    const [refetch, { data: driverDetails }] = useLazyGetDriverDetailsQuery(id, {skip: !id || !isDriverLogged, ...options})
    useEffect(()=>{
        if(id && isDriverLogged){
            refetch(id)
        }
    },[id])
    useDisptachDriverDetails(driverDetails)
    return { driverDetails, refetch }
}

export const useUpdateDriverStatus = () => {
    const [_updateDriverStatus] = useUpdateDriverStatusMutation();
    const dispatch = useDispatch()

    const updateDriverStatus = (isOnline, cb) => {
        _updateDriverStatus({ is_available: isOnline ? 1 : 0 }).unwrap().then((res) => {
            dispatch(setDriverStatus({ is_available: isOnline ? DriverAvailableStatus.ONLINE : DriverAvailableStatus.OFFLINE }))
        }).catch(() => cb?.(!isOnline))
    }
    return updateDriverStatus
}