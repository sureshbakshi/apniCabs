import { useEffect } from "react"
import driverSocket, { connectSocket, disconnectSocket, onActiveRide, onCanceActiveRide } from "../sockets/userSockets"
import { useDispatch } from "react-redux"
import { onRequestUpdate } from "../sockets/userSockets"
import { cancelActiveRide, setActiveRide, updateDriversRequest } from "../slices/userSlice"

export default (() => {
    const dispatch = useDispatch()
    useEffect(() => {
        connectSocket()
        onRequestUpdate((res)=> dispatch(updateDriversRequest(res)))
        onActiveRide((res)=> dispatch(setActiveRide(res)))
        onCanceActiveRide((res)=> dispatch(cancelActiveRide(res)))
        return () => disconnectSocket()
    }, [])
})