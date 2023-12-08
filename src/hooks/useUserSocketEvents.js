import { useEffect } from "react"
import { connectSocket, disconnectSocket } from "../sockets/userSockets"
import { useDispatch } from "react-redux"
import { onRequestUpdate } from "../sockets/userSockets"
import { updateDriversRequest } from "../slices/userSlice"
import { _isLoggedIn } from "../util"

export default (() => {
    const dispatch = useDispatch();
    const isLoggedIn = _isLoggedIn();
    useEffect(() => {
        if (isLoggedIn) {
            connectSocket()
            onRequestUpdate((res) => dispatch(updateDriversRequest(res)))
        }
        return () => disconnectSocket()
    }, [isLoggedIn])
})