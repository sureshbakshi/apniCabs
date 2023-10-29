import { useEffect } from "react"
import driverSocket, { connectSocket, disconnectSocket, emitCancelRequest, emitDeclineRequest, emitDriverStatus, getRideRequests, onActiveRide, onDriverStatus } from "../sockets/driverSockets"
import { useDispatch, useSelector } from "react-redux"
import { cancelRequest, declineRequest, setActiveRide, setDriverStatus, setRideRequest } from "../slices/driverSlice"


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
        dispatch(declineRequest(response))
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
        dispatch(setRideRequest(request))
    }
    
    return {updateDriverStatus, updateActiveRide, updateRideRequests, emitDriverStatusEvent, emitDeclineRequestEvent, emitCancelRequestEvent}
}

export default (() => {
    const {updateDriverStatus, updateActiveRide, updateRideRequests} = useDriverEvents()
    const {isOnline} = useSelector((state) => state.driver)
    useEffect(() => {
        onDriverStatus(updateDriverStatus)
        connectSocket()
        if(isOnline) {
            getRideRequests(updateRideRequests)
            onActiveRide(updateActiveRide)
        }
        return () => disconnectSocket()
    }, [isOnline])
})
