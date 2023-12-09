import { useEffect } from "react"
import userSocket, { connectSocket, disconnectSocket } from "../sockets/userSockets"
import { useDispatch, useSelector } from "react-redux"
import { onRequestUpdate } from "../sockets/userSockets"
import { updateDriversRequest, updatedSocketConnectionStatus } from "../slices/userSlice"
import { _isLoggedIn } from "../util";
import { store } from "../store"




export default (() => {
    const { isSocketConnected } = useSelector((state) => state.user)
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const isLoggedIn = _isLoggedIn();
    useEffect(() => {
        if (isLoggedIn) {
            connectSocket()
            onRequestUpdate((res) => dispatch(updateDriversRequest(res?.data)))
        }
        return () => disconnectSocket()
    }, [isLoggedIn])

    useEffect(() => {
            userSocket.on('connect', () => {
                console.log('onconnect',userInfo?.id)
                if (userInfo?.id) {
                    console.log(`============= addDevice ==========`)
                    userSocket.emit('addDevice', userInfo?.id)
                    dispatch(updatedSocketConnectionStatus(userInfo?.id))
                }
            })
        userSocket.on('disconnect', err => dispatch(updatedSocketConnectionStatus(null)))

    })
})