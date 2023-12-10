import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateDriversRequest, updatedSocketConnectionStatus } from "../slices/authSlice"
import { _isLoggedIn } from "../util";
import userSocket from '../sockets/socketConfig';

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
        } else {
            disconnectUserSocket();
        }
        return () => disconnectUserSocket();
    }, [isLoggedIn])

    useEffect(() => {
        userSocket.on('connect', () => {
            console.log('onconnect - add device', userInfo?.id)
            addDevice()
        })
        userSocket.on('disconnect', err => dispatch(updatedSocketConnectionStatus(null)))

    })
})