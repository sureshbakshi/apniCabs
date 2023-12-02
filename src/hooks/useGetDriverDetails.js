import { useDispatch } from "react-redux"
import { useGetDriverDetailsQuery } from "../slices/apiSlice"
import { setDriverDetails } from "../slices/authSlice"
import { useEffect } from "react"
import { isEmpty } from 'lodash'

export const useDisptachDriverDetails = (details) => {
    const dispatch = useDispatch()
    useEffect(() => {
        if (!isEmpty(details))
            dispatch(setDriverDetails(details))
    }, [details])
}


export default useGetDriverDetails = (id, options) => {
    const { data: driverDetails } = useGetDriverDetailsQuery(id, options)
    useDisptachDriverDetails(driverDetails)
    return driverDetails
}