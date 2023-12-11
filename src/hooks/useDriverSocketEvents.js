import { useEffect } from "react"
import driverSocket from "../sockets/driverSockets"
import { useDispatch, useSelector } from "react-redux"
import { setRideRequest, updateRideRequest, updateRideStatus } from "../slices/driverSlice"
import { _isDriverOnline, _isLoggedIn } from "../util"
import { updatedSocketConnectionStatus } from "../slices/authSlice"
import { ClearRideStatus, DriverAvailableStatus, RideStatus } from "../constants"


const SOCKET_EVENTS = {
    get_ride_requests: 'request',
}

export const useDriverEvents = () => {
    const dispatch = useDispatch()

    const updateRideRequests = (request) => {
        const { status } = request?.data || {}
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
    const dispatch = useDispatch();
    const { userInfo, isSocketConnected } = useSelector((state) => state.auth)
    const { updateRideRequests } = useDriverEvents();
    const { isOnline } = useSelector((state) => state.driver)

    const isDriverOnline = isOnline !== DriverAvailableStatus.OFFLINE;
    const isLoggedIn = _isLoggedIn();


    const addDevice = () => {
        if (userInfo?.id) {
            console.log(`============= Driver add device emit ==========`)
            driverSocket.emit('addDevice', userInfo?.id, (cbRes) => {
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
        console.log('isDriverOnline', isDriverOnline, isLoggedIn)
        if (isDriverOnline && isLoggedIn) {
            connectSocket()
            onGetRideRequests(updateRideRequests);
        } else if (!isLoggedIn) {
            disconnectDriverSocket();
        }
        // return () =>{ 
        //     console.log('driver useEffect disconnected')
        //     disconnectDriverSocket()
        // }
    }, [isDriverOnline, isLoggedIn])

    useEffect(() => {
        driverSocket.on('connect', () => {
            addDevice()
        })
        driverSocket.on('disconnect', err => { console.log('disconnected', err); dispatch(updatedSocketConnectionStatus(null)) })

    })
})
