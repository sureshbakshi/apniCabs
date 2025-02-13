import { useCallback, useEffect } from "react"
import { useSendDeviceTokenMutation } from "../slices/apiSlice"
import { useSelector } from "react-redux";
import { Platform } from "react-native";

export default () => {
    const { device_token, access_token } = useSelector((state) => state.auth)
    const [sendDeviceToken] = useSendDeviceTokenMutation();

    const submitDeviceToken = useCallback(() => {
        // sendDeviceToken({ device_token, device_type: Platform.OS })
    }, [access_token, device_token])

   
    useEffect(() => {
        if (access_token && device_token) {
            submitDeviceToken()
        }
    }, [access_token, device_token])

    return submitDeviceToken
}