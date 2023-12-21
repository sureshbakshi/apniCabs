import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updatedSocketConnectionStatus } from "../slices/authSlice";

import { _isLoggedIn } from "../util";
import userSocket from '../sockets/socketConfig';
import { updateDriverLocation, updateDriversRequest } from "../slices/userSlice";
import { store } from "../store";

const SOCKET_EVENTS = {
    request_status: 'useRequestUpdate',
    driver_location: 'driverLocation'
}


export const disconnectUserSocket = () => {
    console.log(`============= user Client disconnection - request ==========`)
    userSocket.disconnect()
}

export default (() => {
    const { isSocketConnected } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const isLoggedIn = _isLoggedIn();
    const baseSocketOn = userSocket.on;

    userSocket.on = function() {
        var ignoreEvents = ['connect','disconnect', SOCKET_EVENTS.request_status, SOCKET_EVENTS.driver_location] 

        if (userSocket._callbacks !== undefined &&
            typeof userSocket._callbacks[`$${arguments[0]}`] !== 'undefined' &&
            ignoreEvents.indexOf(arguments[0]) === -1) {
               return;
        }
        console.log({arguments, cb: userSocket._callbacks, arg: arguments[0], key: userSocket._callbacks[`$${arguments[0]}`]})
        return baseSocketOn.apply(this, arguments)
    };

    const addDevice = () => {
        const id = store.getState().auth.userInfo?.id
        console.log({addDeviceId: id})
        if (id) {
            console.log(`============= User add device emit ==========`)
            userSocket.emit('addDevice', id, (cbRes) => {
                console.log({cbRes: cbRes?.socketId, connectedId: userSocket?.id})
                dispatch(updatedSocketConnectionStatus(cbRes?.socketId))
            })
        }
    }
    // listeners
    const onRequestUpdate = () => {
        userSocket.on(SOCKET_EVENTS.request_status, (updatedRequest) => {
            // Handle the driver list update in the UI
            // cb(updatedRequest)
            if(updatedRequest?.data){
                dispatch(updateDriversRequest(updatedRequest?.data))
            }
        });
    };

    const onDriverLocationUpdate = () =>{
        console.log('socket._callbacks', userSocket._callbacks)
        userSocket.on(SOCKET_EVENTS.driver_location, (updatedLocation) => {
            // Handle the driver list update in the UI
            // cb(updatedRequest)
            if(updatedLocation?.data) {
                dispatch(updateDriverLocation(updatedLocation.data))
            }
        }); 
    }

    const connectSocket = () => {
        if (userSocket.connected) {
            console.log(`============= user Client connection - add device ==========`)
            addDevice()
        } else {
            console.log(`============= user Client connection - request ==========`)
            userSocket.connect()
        }
    }

    useEffect(() => {
        if (isLoggedIn && !Boolean(isSocketConnected)) {
            connectSocket()
            onRequestUpdate()
            onDriverLocationUpdate()
        } else if (!isLoggedIn) {
            disconnectUserSocket();
        }
    }, [isLoggedIn,isSocketConnected])

    useEffect(() => {
        userSocket.on('connect', () => {
            console.log('onconnect - add device')
            onRequestUpdate()
            onDriverLocationUpdate()
            addDevice()
        })
        userSocket.on('disconnect', err => dispatch(updatedSocketConnectionStatus(null)))

    })
})