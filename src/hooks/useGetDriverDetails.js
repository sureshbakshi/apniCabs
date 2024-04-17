import { useDispatch } from "react-redux"
import { useGetDriverDetailsQuery, useUpdateDriverStatusMutation } from "../slices/apiSlice"
import { setDriverDetails } from "../slices/authSlice"
import { useEffect } from "react"
import { isEmpty } from 'lodash'
import { setDriverStatus } from "../slices/driverSlice"

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
    const { data: driverDetails, refetch } = useGetDriverDetailsQuery(id, options)
    useDisptachDriverDetails(driverDetails)
    return { driverDetails, refetch }
}

export const useUpdateDriverStatus = () => {
    const [_updateDriverStatus] = useUpdateDriverStatusMutation();
    const dispatch = useDispatch()

    const updateDriverStatus = (isOnline, cb) => {
        _updateDriverStatus({ is_available: isOnline ? 1 : 0 }).unwrap().then((res) => {
            dispatch(setDriverStatus(res))
        }).catch(() => cb?.(!isOnline))
    }
    return updateDriverStatus
}