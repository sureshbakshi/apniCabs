import { useEffect } from "react"
import driverSocket, { connectSocket, disconnectSocket, emitCancelRequest, emitDeclineRequest, emitDriverStatus, onActiveRide, onDriverStatus, onGetRideRequests } from "../sockets/driverSockets"
import { useDispatch, useSelector } from "react-redux"
import { cancelRequest, setActiveRide, setDriverStatus, setRideRequest, updateRideRequest } from "../slices/driverSlice"
import { isAvailable } from "../util"


export const useSetDriverStatus = () => {
    const dispatch = useDispatch()
    const updateStatus = (status) => {
        dispatch(setDriverStatus(status))
    }
    return updateStatus
}

export const useDriverEvents = () => {
    const dispatch = useDispatch()
    
    const emitDriverStatusEvent = (status) =>{
        emitDriverStatus(status, (res) => updateDriverStatus(res?.isOnline))
    }
    const emitDeclineRequestEvent = (requestObj) =>{
        emitDeclineRequest(requestObj, (res) => updateDeclineRequest(res))
    }
    const emitCancelRequestEvent = (activeRequest, cb) => {
        emitCancelRequest(activeRequest, (res) => {
            cb ()
            updateCancelRequest(res)})
    }

    const updateDeclineRequest = (response) =>{
        dispatch(updateRideRequest(response))
    }

    const updateCancelRequest = (activeReq) =>{
        dispatch(cancelRequest(activeReq))

    }

    const updateDriverStatus = (status) => {
        dispatch(setDriverStatus(status))
    }

    const updateActiveRide = (activeRequest) => {
        dispatch(setActiveRide(activeRequest))
    }

    const updateRideRequests = (request) => {
        console.log({request})
        dispatch(setRideRequest(request?.data))
    }
    
    return {updateDriverStatus, updateActiveRide, updateRideRequests, emitDriverStatusEvent, emitDeclineRequestEvent, emitCancelRequestEvent}
}

export default (() => {
    const {updateDriverStatus, updateActiveRide, updateRideRequests} = useDriverEvents()
    const {driverInfo} = useSelector((state) => state.auth)
    useEffect(() => {
        // onDriverStatus(updateDriverStatus)
        if(isAvailable(driverInfo)) {
            connectSocket()
            onGetRideRequests(updateRideRequests)
            // onActiveRide(updateActiveRide)
        }
        return () => disconnectSocket()
    }, [driverInfo])
})
