import { useCallback, useEffect } from "react"
import driverSocket from "../sockets/socketConfig"
import { useDispatch, useSelector } from "react-redux"
import { setRideRequest, updateRideRequest, updateRideStatus } from "../slices/driverSlice"
import { _isLoggedIn, isValidEvent } from "../util"
import { clearRideChats, updatedSocketConnectionStatus } from "../slices/authSlice"
import { ClearRideStatus, DriverAvailableStatus, RideStatus, SOCKET_EVENTS } from "../constants"
import { store } from "../store"
import useNotificationSound from "./useNotificationSound"
import useChatMessage from "./useChatMessage"

const DRIVER_SOCKET_EVENTS = {
    get_ride_requests: 'DriverRequestSocket',
}

export const useDriverEvents = () => {
    const dispatch = useDispatch()
    const { playSound } = useNotificationSound()

    const updateRideRequests = (request) => {
        const { status } = request || {}
        console.log('updateRideRequests', request)
        if (status) {
            if (status === RideStatus.REQUESTED) {
                dispatch(setRideRequest(request))
                playSound()
            } else if (ClearRideStatus.includes(status)) {
                dispatch(updateRideRequest(request))
                dispatch(clearRideChats(clearRideChats))
                driverSocket.emit(SOCKET_EVENTS.rideCompleted);
            } else {
                dispatch(updateRideRequest(request))
            }
        }
    }

    return { updateRideRequests }
}


const onGetRideRequests = (cb) => {
    driverSocket.on(DRIVER_SOCKET_EVENTS.get_ride_requests, (request) => {
        console.log('on new request', request)
        const newUpdatedRequest = {
            Request: request,
            ...request
        }
        cb(newUpdatedRequest)
    });
};


export const disconnectDriverSocket = () => {
    console.log(`============= Driver Client disconnection - request ==========`, driverSocket)
    driverSocket.disconnect()
}
const ignoreEvents = [];
// ['connect', 'disconnect', DRIVER_SOCKET_EVENTS.get_ride_requests];

export default (() => {
    const { isSocketConnected } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const { updateRideRequests } = useDriverEvents();
    const { onlineStatus, activeRequestInfo } = useSelector((state) => state.driver);
    const onChat = useChatMessage()

    const isDriverOnline = onlineStatus !== DriverAvailableStatus.OFFLINE;
    const isLoggedIn = _isLoggedIn();
    const baseSocketOn = driverSocket.on;

    driverSocket.on = function (eventName) {
        if (isValidEvent.call(this, eventName, ignoreEvents)) {
            return;
        }
        return baseSocketOn.apply(this, arguments);
    };


    const updateDriverSocketId = useCallback(() => {
        if (driverSocket?.id) {
            console.log(`============= Update driver socket id ==========: ${driverSocket?.id}`)
            dispatch(updatedSocketConnectionStatus(driverSocket?.id))
        }
    }, [driverSocket])

    const connectSocket = useCallback(() => {
            driverSocket.connect();
    }, [driverSocket]);



    useEffect(() => {
        console.log({ isSocketConnected, driverSocket: driverSocket?.connected, isDriverOnline , isLoggedIn})
        if (isDriverOnline && isLoggedIn && !Boolean(isSocketConnected) && !Boolean(driverSocket?.connected)) {
            console.log('================= on connect ======================')
            connectSocket()
            onGetRideRequests(updateRideRequests);
            updateDriverSocketId()
        } else if ((!isLoggedIn || !isDriverOnline)) {
            disconnectDriverSocket();
        }
    }, [isDriverOnline, isLoggedIn, isSocketConnected, driverSocket?.connected])

    useEffect(() => {
        driverSocket.on('connect', (res) => {
            console.log('================= on connect ======================', res, driverSocket?.id)
            updateDriverSocketId()
            onGetRideRequests(updateRideRequests);

        })
        driverSocket.on('disconnect', err => {
            console.log('disconnected', err)
            dispatch(updatedSocketConnectionStatus(null))
        })
    }, [driverSocket]);

    useEffect(() => {
        if (activeRequestInfo?.id && isSocketConnected) {
            onChat(driverSocket);
        }
    }, [activeRequestInfo?.id])
})

