import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updatedSocketConnectionStatus } from "../slices/authSlice";

import { _isLoggedIn } from "../util";
import userSocket from '../sockets/socketConfig';
import { updateDriversRequest } from "../slices/userSlice";

const SOCKET_EVENTS = {
    request_status: 'useRequestUpdate'
}


export const disconnectUserSocket = () => {
    console.log(`============= user Client disconnection - request ==========`)
    userSocket.disconnect()
}

export default (() => {
    const { userInfo, isSocketConnected } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const isLoggedIn = _isLoggedIn();

    const addDevice = () => {
        if (userInfo?.id) {
            console.log(`============= User add device emit ==========`)
            userSocket.emit('addDevice', userInfo?.id)
            dispatch(updatedSocketConnectionStatus(userInfo?.id))
        }
    }
    // listeners
    const onRequestUpdate = (cb) => {
        userSocket.on(SOCKET_EVENTS.request_status, (updatedRequest) => {
            // Handle the driver list update in the UI
            cb(updatedRequest)
        });
    };

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
            onRequestUpdate((res) => dispatch(updateDriversRequest(res?.data)))
        } else if (!isLoggedIn) {
            disconnectUserSocket();
        }
        return () => disconnectUserSocket();
    }, [isLoggedIn,isSocketConnected])

    useEffect(() => {
        userSocket.on('connect', () => {
            console.log('onconnect - add device', userInfo?.id)
            addDevice()
        })
        userSocket.on('disconnect', err => dispatch(updatedSocketConnectionStatus(null)))

    })
})