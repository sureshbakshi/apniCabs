import { useEffect } from "react"
import  { connectSocket, disconnectSocket, getRideRequests } from "../sockets/driverSockets"

export default (() => {
    useEffect(() => {
        connectSocket()
        getRideRequests()
        return () => disconnectSocket()
    }, [])
})