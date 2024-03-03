import { useCallback, useEffect } from "react"
import driverSocket from "../sockets/socketConfig"
import { useDispatch, useSelector } from "react-redux"
import { setRideRequest, updateRideRequest, updateRideStatus } from "../slices/driverSlice"
import { _isLoggedIn, isValidEvent } from "../util"
import { updatedSocketConnectionStatus } from "../slices/authSlice"
import { ClearRideStatus, DriverAvailableStatus, RideStatus } from "../constants"
import { store } from "../store"
import SoundPlayer from 'react-native-sound-player'
import audio from "../assets/audio"

const SOCKET_EVENTS = {
    get_ride_requests: 'request',
}

export const useDriverEvents = () => {
    const dispatch = useDispatch()

    const setSoundConfig = () => {
        SoundPlayer.setSpeaker(true)
        SoundPlayer.setVolume(1);
    }

    useEffect(() => {
        const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
            if (success) {
                setSoundConfig()
            }
        })
        return () => _onFinishedLoadingSubscription.remove()

    }, [])

    const updateRideRequests = (request) => {
        const { status } = request?.data || {}

        if (status) {
            if (status === RideStatus.REQUESTED) {
                dispatch(setRideRequest(request?.data))
                SoundPlayer.playUrl(audio.notify)
            } else if (ClearRideStatus.includes(status)) {
                dispatch(updateRideStatus(request?.data))
            } else {
                dispatch(updateRideRequest(request?.data))
            }
        }
    }

    return { updateRideRequests }
}


const onGetRideRequests = (cb) => {
    driverSocket.on(SOCKET_EVENTS.get_ride_requests, (request) => {
        console.log('on new request')
        cb(request)
    });
};

export const disconnectDriverSocket = () => {
    console.log(`============= Driver Client disconnection - request ==========`, driverSocket)
    driverSocket.disconnect()
}
const ignoreEvents = [];
// ['connect', 'disconnect', SOCKET_EVENTS.get_ride_requests];

export default (() => {
    const { isSocketConnected } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const { updateRideRequests } = useDriverEvents();
    const { isOnline } = useSelector((state) => state.driver)

    const isDriverOnline = isOnline !== DriverAvailableStatus.OFFLINE;
    const isLoggedIn = _isLoggedIn();
    const baseSocketOn = driverSocket.on;

      driverSocket.on = function (eventName) {
        if (isValidEvent.call(this, eventName, ignoreEvents)) {
          return;
        }
        return baseSocketOn.apply(this, arguments);
      };


    const addDevice = useCallback(() => {
        const id = store.getState().auth.userInfo?.id
        if (id) {
            console.log(`============= Driver add device emit ==========: ${id}`)
            driverSocket.emit('addDevice', id, (cbRes) => {
                // console.log({cbRes: cbRes?.socketId,  connectedId: driverSocket?.id})
                dispatch(updatedSocketConnectionStatus(cbRes?.socketId))
            })
        }
    },[driverSocket])

    const connectSocket = useCallback(() => {
        if (driverSocket.connected) {
          addDevice();
        } else {
          driverSocket.connect();
        }
      }, [addDevice, driverSocket]);



    useEffect(() => {
        console.log({isSocketConnected, driverSocket: driverSocket?.connected, isDriverOnline})
        if (isDriverOnline && isLoggedIn && !Boolean(isSocketConnected) && !Boolean(driverSocket?.connected)) {
            connectSocket()
            onGetRideRequests(updateRideRequests);
        } else if (!isLoggedIn || !isDriverOnline) {
            disconnectDriverSocket();
        }
    }, [isDriverOnline, isLoggedIn, isSocketConnected, driverSocket?.connected])

    useEffect(() => {
        driverSocket.on('connect', () => {
            console.log('================= on connect ======================')
            addDevice()
            onGetRideRequests(updateRideRequests);

        })
        driverSocket.on('disconnect', err => {
            console.log('disconnected', err)
            dispatch(updatedSocketConnectionStatus(null)) 
        })
    }, [driverSocket])
})

