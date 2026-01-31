import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatedSocketConnectionStatus, clearRideChats } from "../slices/authSlice";
import { setRideRequest, updateRideRequest, updateRideStatus } from "../slices/driverSlice";
import { createSocketInstance, getSocketInstance } from '../sockets/socketConfig';
import useNotificationSound from "./useNotificationSound";
import useChatMessage from "./useChatMessage";
import { RideStatus, ClearRideStatus, SOCKET_EVENTS, DriverAvailableStatus } from "../constants";

const DRIVER_SOCKET_EVENTS = {
    get_ride_requests: 'DriverRequestSocket',
};

export default function useDriverSocketEvents() {
    const { userInfo, access_token, isSocketConnected } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { onlineStatus, activeRequestInfo } = useSelector((state) => state.driver);
    const onChat = useChatMessage();
    const isDriverOnline = onlineStatus !== DriverAvailableStatus.OFFLINE;
    const isLoggedIn = !!userInfo?.id && !!access_token;
    const [socketReady, setSocketReady] = useState(false);
    const { playSound } = useNotificationSound();

    const updateDriverSocketId = useCallback(() => {
        const socket = getSocketInstance();
        if (socket?.id) {
            dispatch(updatedSocketConnectionStatus(socket?.id));
        }
    }, [dispatch]);

    // Called when socket connects
    const handleSocketConnected = useCallback((socket) => {
        updateDriverSocketId();
        setSocketReady(s => !s); // Toggle to trigger useEffect
    }, [updateDriverSocketId]);

    // Create/connect socket when needed
    useEffect(() => {
        const socket = getSocketInstance();
        if (isDriverOnline && isLoggedIn && !socket?.connected) {
            createSocketInstance(
                { userId: userInfo?.id, token: access_token || null},
                handleSocketConnected
            );
        } else if ((!isLoggedIn || !isDriverOnline)) {
            dispatch(updatedSocketConnectionStatus(null));
            const socket = getSocketInstance();
            socket?.disconnect();
        }
        // eslint-disable-next-line
    }, [isDriverOnline, isLoggedIn, userInfo?.id, access_token, handleSocketConnected, dispatch]);

    // Attach listeners when socket is ready
    useEffect(() => {
        const socket = getSocketInstance();
        if (!socket) return;

        const handleRideRequest = (request) => {
            console.log('Received DriverRequestSocket event:', request);
            const { status } = request || {};
            if (status) {
                if (status === RideStatus.REQUESTED) {
                    dispatch(setRideRequest(request));
                    playSound();
                } else if (ClearRideStatus.includes(status)) {
                    if (request?.type === 'REQUEST') {
                        dispatch(updateRideRequest(request));
                    } else {
                        dispatch(updateRideStatus(request));
                        dispatch(clearRideChats());
                        socket.emit(SOCKET_EVENTS.rideCompleted, {rideId: request?.request_id});
                    }
                } else {
                    dispatch(updateRideRequest(request));
                }
            }
        };

        const handleDisconnect = () => {
            dispatch(updatedSocketConnectionStatus(null));
        };

        socket.on(DRIVER_SOCKET_EVENTS.get_ride_requests, handleRideRequest);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off(DRIVER_SOCKET_EVENTS.get_ride_requests, handleRideRequest);
            socket.off('disconnect', handleDisconnect);
        };
    }, [socketReady, dispatch, playSound]);

    // Attach chat listeners when needed
    useEffect(() => {
        const socket = getSocketInstance();
        if (activeRequestInfo?.id && isSocketConnected && activeRequestInfo?.status === RideStatus.ACCEPTED) {
            const cleanup = onChat(socket, activeRequestInfo.id);
            return () => {
                cleanup?.();
            };
        }
        return undefined;
    }, [activeRequestInfo?.id, isSocketConnected, activeRequestInfo?.status, onChat]);
}

