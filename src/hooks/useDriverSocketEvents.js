import { useEffect } from "react"
import { connectSocket, disconnectSocket, onGetRideRequests } from "../sockets/driverSockets"
import { useDispatch } from "react-redux"
import { setRideRequest } from "../slices/driverSlice"
import { _isDriverOnline, _isLoggedIn } from "../util"

export const useDriverEvents = () => {
    const dispatch = useDispatch()

    const updateRideRequests = (request) => {
        dispatch(setRideRequest(request?.data))
    }

    return { updateRideRequests }
}

export default (() => {
    const { updateRideRequests } = useDriverEvents()
    const isDriverOnline = _isDriverOnline();
    const isLoggedIn = _isLoggedIn();

    useEffect(() => {
        if (isDriverOnline && isLoggedIn) {
            connectSocket()
            onGetRideRequests(updateRideRequests)
        }
        return () => disconnectSocket()
    }, [isDriverOnline, isLoggedIn])
})
