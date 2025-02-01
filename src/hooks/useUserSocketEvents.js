import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearRideChats, setRideChats, updatedSocketConnectionStatus } from "../slices/authSlice";

import { _isLoggedIn, isValidEvent } from "../util";
import userSocket from '../sockets/socketConfig';
import { updateDriverLocation, updateDriversRequest } from "../slices/userSlice";
import { store } from "../store";
import useNotificationSound from "./useNotificationSound";
import audio from "../assets/audio";
import { ClearRideStatus, RideStatus, SOCKET_EVENTS } from "../constants";
import useChatMessage from "./useChatMessage";

const USER_SOCKET_EVENTS = {
    request_status: 'useRequestUpdate',
    driver_location: 'driverLocation'
}


export const disconnectUserSocket = () => {
    userSocket.disconnect()
}
const ignoreEvents = []
// ['connect', 'disconnect', USER_SOCKET_EVENTS.request_status, USER_SOCKET_EVENTS.driver_location]


export default (() => {
    const { isSocketConnected, userInfo } = useSelector((state) => state.auth);
    const { activeRideId } = useSelector((state) => state.user);
    const onChat = useChatMessage();
    const { playSound } = useNotificationSound();

    const dispatch = useDispatch();
    const isLoggedIn = _isLoggedIn();
    const baseSocketOn = userSocket.on;

    userSocket.on = function (eventName) {
        if (isValidEvent.call(this, eventName, ignoreEvents)) {
            return;
        }
        // console.log({new: eventName, cb: this._callbacks, arguments})
        return baseSocketOn.apply(this, arguments);
    };

    const addDevice = () => {
        const id = store.getState().auth.userInfo?.id
        console.log({ addDeviceId: id })
        if (id) {
            // console.log(`============= User add device emit ==========`)
            dispatch(updatedSocketConnectionStatus(id))

            // userSocket.emit('addDevice', id, (cbRes) => {
            //     // console.log({cbRes: cbRes?.socketId, connectedId: userSocket?.id})
            // })
        }
    }
    // listeners
    const onRequestUpdate = () => {
        userSocket.on(USER_SOCKET_EVENTS.request_status, (updatedRequest) => {
            // Handle the driver list update in the UI
            // cb(updatedRequest)
            if (updatedRequest?.data) {
                const { status } = updatedRequest?.data || {}
                if (status) {
                    if (status === RideStatus.ACCEPTED) {
                        playSound(audio.booking)
                    }
                    if (ClearRideStatus.includes(status)) {
                        userSocket.emit(SOCKET_EVENTS.rideCompleted);
                        dispatch(clearRideChats());
                    }
                }
                dispatch(updateDriversRequest(updatedRequest?.data))
            }
        });
    };

    const onDriverLocationUpdate = () => {
        // console.log('socket._callbacks', userSocket._callbacks)
        userSocket.on(USER_SOCKET_EVENTS.driver_location, (updatedLocation) => {
            // Handle the driver list update in the UI
            // cb(updatedRequest)
            if (updatedLocation?.data) {
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
        if (isLoggedIn && !Boolean(isSocketConnected) && !Boolean(userSocket?.connected)) {
            connectSocket()
            onRequestUpdate()
            onDriverLocationUpdate()
        } else if (!isLoggedIn) {
            disconnectUserSocket();
        }
    }, [isLoggedIn, isSocketConnected]);

    useEffect(() => {
        if (activeRideId && isSocketConnected) {
            onChat(userSocket);
        }
    }, [activeRideId])

    useEffect(() => {
        userSocket.on('connect', () => {
            onRequestUpdate()
            onDriverLocationUpdate()
            addDevice()
        })
        userSocket.on('disconnect', err => dispatch(updatedSocketConnectionStatus(null)))

    })
})