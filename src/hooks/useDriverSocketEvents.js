import { useEffect } from "react"
import driverSocket, { connectSocket, disconnectSocket, getRideRequests, onActiveRide } from "../sockets/driverSockets"
import { useDispatch } from "react-redux"
import { setRideStatus } from "../slices/driverSlice"

export default (() => {
    const dispatch = useDispatch()
    useEffect(() => {
        connectSocket()
        getRideRequests()
        onActiveRide((res)=> dispatch(setRideStatus(res)))
        return () => disconnectSocket()
    }, [])
})