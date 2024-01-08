import { useEffect } from "react"
import driverSocket from "../sockets/socketConfig"
import { useDispatch, useSelector } from "react-redux"
import { setRideRequest, updateRideRequest, updateRideStatus } from "../slices/driverSlice"
import { _isDriverOnline, _isLoggedIn } from "../util"
import { updatedSocketConnectionStatus } from "../slices/authSlice"
import { ClearRideStatus, DriverAvailableStatus, RideStatus } from "../constants"
import { store } from "../store"
// import useLocalNotifications from "./useLocalNotifications"

const SOCKET_EVENTS = {
    get_ride_requests: 'request',
}

export const useDriverEvents = () => {
    const dispatch = useDispatch()
    // const { scheduleLocalNotification } = useLocalNotifications();

    const updateRideRequests = (request) => {
        const { status } = request?.data || {}
        // scheduleLocalNotification('Local Notification', 'This is a test local notification', { customData: request?.data });

        if (status) {
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


const onGetRideRequests = (cb) => {
    driverSocket.on(SOCKET_EVENTS.get_ride_requests, (request) => {
        cb(request)
    });
};

export const disconnectDriverSocket = () => {
    console.log(`============= Driver Client disconnection - request ==========`)
    driverSocket.disconnect()
}

export default (() => {
    const { isSocketConnected } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const { updateRideRequests } = useDriverEvents();
    const { isOnline } = useSelector((state) => state.driver)

    const isDriverOnline = isOnline !== DriverAvailableStatus.OFFLINE;
    const isLoggedIn = _isLoggedIn();
    const baseSocketOn = driverSocket.on;

    driverSocket.on = function() {
        var ignoreEvents = ['connect','disconnect', SOCKET_EVENTS.get_ride_requests] 

        if (driverSocket._callbacks !== undefined &&
            typeof driverSocket._callbacks[`$${arguments[0]}`] !== 'undefined' &&
            ignoreEvents.indexOf(arguments[0]) === -1) {
               return;
        }
        return baseSocketOn.apply(this, arguments)
    };


    const addDevice = () => {
        const id = store.getState().auth.userInfo?.id
        if (id) {
            console.log(`============= Driver add device emit ==========: ${id}`)
            driverSocket.emit('addDevice', id, (cbRes) => {
                console.log({cbRes: cbRes?.socketId,  connectedId: driverSocket?.id})
                dispatch(updatedSocketConnectionStatus(cbRes?.socketId))
            })
        }
    }

    const connectSocket = () => {
        if (driverSocket.connected) {
            console.log(`============= Driver Client connection - add device ==========`)
            addDevice()
        } else {
            console.log(`============= Driver Client connection - request ==========`)
            driverSocket.connect()
        }
    }

   

    useEffect(() => {
        if (isDriverOnline && isLoggedIn && !Boolean(isSocketConnected) && !Boolean(driverSocket?.connected)) {
            console.log('isDriverOnline', isDriverOnline, isLoggedIn)
            connectSocket()
            onGetRideRequests(updateRideRequests);
        } else if (!isLoggedIn || !isDriverOnline) {
            disconnectDriverSocket();
        }
    }, [isDriverOnline, isLoggedIn, isSocketConnected])

    useEffect(() => {
        driverSocket.on('connect', () => {
            console.log('================= on connect ======================')
            addDevice()
            onGetRideRequests(updateRideRequests);

        })
        driverSocket.on('disconnect', err => { console.log('disconnected', err); dispatch(updatedSocketConnectionStatus(null)) })
    },[driverSocket])
})
