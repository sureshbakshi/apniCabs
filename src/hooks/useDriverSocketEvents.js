import { useEffect } from "react"
import driverSocket, { connectSocket, disconnectSocket, onGetRideRequests } from "../sockets/driverSockets"
import { useDispatch, useSelector } from "react-redux"
import { setRideRequest, updateRideRequest, updateRideStatus } from "../slices/driverSlice"
import { _isDriverOnline, _isLoggedIn } from "../util"
import { updatedSocketConnectionStatus } from "../slices/userSlice"
import { ClearRideStatus, DriverAvailableStatus, RideStatus } from "../constants"

export const useDriverEvents = () => {
    const dispatch = useDispatch()

    const updateRideRequests = (request) => {
        const {status} = request?.data || {}
        if(status) {
            if (status === RideStatus.REQUESTED) {
                dispatch(setRideRequest(request?.data))
            } else if (ClearRideStatus.includes(status)) {
                dispatch(updateRideStatus(request?.data))
            } else {
                dispatch(updateRideRequest(request?.data))
            }
        }
    }

    return { updateRideRequests }
}

export default (() => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth)

    const { updateRideRequests } = useDriverEvents();
    const { isOnline } = useSelector((state) => state.driver)

    const isDriverOnline = isOnline !== DriverAvailableStatus.OFFLINE;
    const isLoggedIn = _isLoggedIn();

    useEffect(() => {
        console.log('isDriverOnline', isDriverOnline, isLoggedIn)
        if (isDriverOnline && isLoggedIn) {
            connectSocket()
            onGetRideRequests(updateRideRequests);
        } else if (!isDriverOnline || !isLoggedIn) {
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
        driverSocket.on('disconnect', err => { console.log('disconnected', err); dispatch(updatedSocketConnectionStatus(null)) })

    })
})
