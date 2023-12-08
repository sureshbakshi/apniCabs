import { useEffect } from "react"
import { connectSocket, disconnectSocket, onGetRideRequests } from "../sockets/driverSockets"
import { useDispatch } from "react-redux"
import {  setRideRequest } from "../slices/driverSlice"
import { isAvailable } from "../util"

export const useDriverEvents = () => {
    const dispatch = useDispatch()

    const updateRideRequests = (request) => {
        dispatch(setRideRequest(request?.data))
    }
    
    return { updateRideRequests}
}

export default (() => {
    const {updateRideRequests} = useDriverEvents()
    useEffect(() => {
        if(isAvailable()) {
            connectSocket()
            onGetRideRequests(updateRideRequests)
        }
        return () => disconnectSocket()
    }, [isAvailable])
})
