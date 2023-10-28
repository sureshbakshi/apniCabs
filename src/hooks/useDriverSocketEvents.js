import { useEffect } from "react"
import driverSocket, { connectSocket, disconnectSocket, emitDriverStatus, getRideRequests, onActiveRide, onDriverStatus } from "../sockets/driverSockets"
import { useDispatch } from "react-redux"
import { setDriverStatus, setRideStatus } from "../slices/driverSlice"


export const useSetDriverStatus = () => {
    const dispatch = useDispatch()
    const updateStatus = (status) => {
        dispatch(setDriverStatus(status))
    }
    return updateStatus
}

export const useSetRideStatus = () => {
    const dispatch = useDispatch()
    const updateRideStatus = (status) => {
        dispatch(setRideStatus(status))
    }
    return updateRideStatus
}

export const useEmitDriverStatus = () => {
    const updateStatus = useSetDriverStatus()
    const updateDriverStatus = (status) => {
        emitDriverStatus(status, updateStatus)
    }
    return updateDriverStatus
}

export default (() => {
    const setDriverStatus = useSetDriverStatus()
    const setRideStatus = useSetRideStatus()
    useEffect(() => {
        connectSocket()
        getRideRequests()
        onActiveRide(setRideStatus)
        onDriverStatus(setDriverStatus)
        return () => disconnectSocket()
    }, [])
})
