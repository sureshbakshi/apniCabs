import { useEffect } from "react"
import userSocket, { connectSocket, disconnectSocket } from "../sockets/userSockets"
import { useDispatch, useSelector } from "react-redux"
import { onRequestUpdate } from "../sockets/userSockets"
import { updateDriversRequest, updatedSocketConnectionStatus } from "../slices/userSlice"
import { _isLoggedIn } from "../util";
import { store } from "../store"




export default (() => {
    const { isSocketConnected } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const isLoggedIn = _isLoggedIn();
    useEffect(() => {
        if (isLoggedIn) {
            connectSocket()
            onRequestUpdate((res) => dispatch(updateDriversRequest(res)))
        }
        return () => disconnectSocket()
    }, [isLoggedIn])

    useEffect(() => {
        if (!isSocketConnected) {
            userSocket.on('connect', () => {
                const authStore = store?.getState().auth
                const id = authStore?.userInfo?.id
                if (id) {
                    console.log(`============= addDevice ==========`)
                    userSocket.emit('addDevice', id)
                    dispatch(updatedSocketConnectionStatus(id))
                }
            })
        }
        userSocket.on('disconnect', err => dispatch(updatedSocketConnectionStatus(null)))

    }, [isSocketConnected])
})