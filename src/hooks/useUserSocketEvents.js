import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearRideChats, updatedSocketConnectionStatus } from "../slices/authSlice";

import { _isLoggedIn, isValidEvent } from "../util";
import userSocket from '../sockets/socketConfig';
import { updateDriverLocation, updateDriversRequest } from "../slices/userSlice";
import { store } from "../store";
import useNotificationSound from "./useNotificationSound";
import audio from "../assets/audio";
import { ClearRideStatus, RideStatus, SOCKET_EVENTS } from "../constants";
import useChatMessage from "./useChatMessage";
import { isEmpty } from "lodash";
const USER_SOCKET_EVENTS = {
    request_status: 'UserRequestSocket',
    driver_location: 'DriverLocationSocket'
}


export const disconnectUserSocket = () => {
    userSocket.disconnect()
}
const ignoreEvents = []
// ['connect', 'disconnect', USER_SOCKET_EVENTS.request_status, USER_SOCKET_EVENTS.driver_location]


export default (() => {
    const { isSocketConnected, userInfo } = useSelector((state) => state.auth);
    const { activeRequestId, activeRequestInfo} = useSelector((state) => state.user);
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

    // listeners
    const onRequestUpdate = () => {
        userSocket.on(USER_SOCKET_EVENTS.request_status, (updatedRequest) => {
            // Handle the driver list update in the UI
            console.log(USER_SOCKET_EVENTS.request_status,updatedRequest )
            // cb(updatedRequest)
            const formatRequest = {
                updatedRequest
            }
            if (!isEmpty(updatedRequest)) {
                const { status } = updatedRequest || {}
                if (status) {
                    if (status === RideStatus.ACCEPTED) {
                        playSound(audio.booking)
                    }
                    if (ClearRideStatus.includes(status)) {
                        userSocket.emit(SOCKET_EVENTS.rideCompleted);
                        dispatch(clearRideChats());
                    }
                }
                dispatch(updateDriversRequest(updatedRequest))
            }
        });
    };

    const onDriverLocationUpdate = () => {
        // console.log('socket._callbacks', userSocket._callbacks)
        userSocket.on(USER_SOCKET_EVENTS.driver_location, (updatedLocation) => {
            // Handle the driver list update in the UI
            // cb(updatedRequest)
            console.log(USER_SOCKET_EVENTS.driver_location, updatedLocation)
            if (updatedLocation?.latitude) {
                dispatch(updateDriverLocation(updatedLocation))
            }
        });
    }

    const updateSockeId = () => {
        console.log(`============= updateSockeId ==========`, userSocket?.id)
        if(userSocket?.id){
            dispatch(updatedSocketConnectionStatus(userSocket?.id))
        }
    }

    const connectSocket = () => {
        if (userSocket.connected) {
            console.log(`============= user Client connection - add device ==========`)
            updateSockeId()
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
        if (activeRequestId && isSocketConnected && activeRequestInfo?.status === RideStatus.ACCEPTED) {
            onChat(userSocket);
        }
    }, [activeRequestId])

    useEffect(() => {
        userSocket.on('connect', () => {
            onRequestUpdate()
            onDriverLocationUpdate()
            updateSockeId()
        })
        userSocket.on('disconnect', err => dispatch(updatedSocketConnectionStatus(null)))

    })
})