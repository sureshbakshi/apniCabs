import { useDispatch } from "react-redux"
import { useGetDriverDetailsQuery } from "../slices/apiSlice"
import { setDriverDetails } from "../slices/authSlice"
import { useEffect } from "react"
import { isEmpty } from 'lodash'
import { setDriverStatus } from "../slices/driverSlice"

export const useDisptachDriverDetails = (details) => {
    const dispatch = useDispatch()
    useEffect(() => {
        if (!isEmpty(details))
            dispatch(setDriverDetails(details))
            dispatch(setDriverStatus(details))
    }, [details])
}


export default useGetDriverDetails = (id, options) => {
    const { data: driverDetails } = useGetDriverDetailsQuery(id, options)
    useDisptachDriverDetails(driverDetails)
    return driverDetails
}