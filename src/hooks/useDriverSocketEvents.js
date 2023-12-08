import { useEffect } from "react"
import driverSocket, { connectSocket, disconnectSocket, onGetRideRequests } from "../sockets/driverSockets"
import { useDispatch, useSelector } from "react-redux"
import { setRideRequest } from "../slices/driverSlice"
import { _isDriverOnline, _isLoggedIn } from "../util"
import { updatedSocketConnectionStatus } from "../slices/userSlice"
import { DriverAvailableStatus } from "../constants"

export const useDriverEvents = () => {
    const dispatch = useDispatch()

    const updateRideRequests = (request) => {
        dispatch(setRideRequest(request?.data))
    }

    return { updateRideRequests }
}

export default (() => {
    const dispatch = useDispatch();
    const { isSocketConnected } = useSelector((state) => state.user)
    const { userInfo } = useSelector((state) => state.auth)

    const { updateRideRequests } = useDriverEvents();
    const { isOnline } = useSelector((state) => state.driver)

    const isDriverOnline = isOnline === DriverAvailableStatus.ONLINE;
    const isLoggedIn = _isLoggedIn();

    useEffect(() => {
        console.log('isDriverOnline', isDriverOnline, isLoggedIn)
        if (isDriverOnline && isLoggedIn) {
            connectSocket()
            onGetRideRequests(updateRideRequests);
        } else if (!isDriverOnline) {
            disconnectSocket();
        }
        return () => disconnectSocket()
    }, [isDriverOnline, isLoggedIn])

    useEffect(() => {
            driverSocket.on('connect', () => {
                if (userInfo?.id) {
                    driverSocket.emit('addDevice', userInfo?.id)
                    dispatch(updatedSocketConnectionStatus(userInfo?.id))
                }
            })
        driverSocket.on('disconnect', err => { console.log('disconnected',err); dispatch(updatedSocketConnectionStatus(null)) })

    }, [isSocketConnected])
})
