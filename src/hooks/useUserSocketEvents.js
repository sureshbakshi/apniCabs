import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearRideChats, updatedSocketConnectionStatus } from "../slices/authSlice";
import { updateDriverLocation, updateDriversRequest } from "../slices/userSlice";
import { createSocketInstance, getSocketInstance } from '../sockets/socketConfig';
import useNotificationSound from "./useNotificationSound";
import useChatMessage from "./useChatMessage";
import audio from "../assets/audio";
import { RideStatus, ClearRideStatus, SOCKET_EVENTS } from "../constants";
import isEmpty from "lodash/isEmpty";

const USER_SOCKET_EVENTS = {
    request_status: 'UserRequestSocket',
    driver_location: 'DriverLocationSocket'
};

export default function useUserSocketEvents() {
    const { isSocketConnected, userInfo, access_token } = useSelector((state) => state.auth);
    const { activeRequestId, activeRequestInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const onChat = useChatMessage();
    const [socketReady, setSocketReady] = useState(false);
    const { playSound } = useNotificationSound();
    const isLoggedIn = !!userInfo?.id && !!access_token;

    const updateUserSocketId = useCallback(() => {
        const socket = getSocketInstance();
        if (socket?.id) {
            dispatch(updatedSocketConnectionStatus(socket?.id));
        }
    }, [dispatch]);

    // Called when socket connects
    const handleSocketConnected = useCallback((socket) => {
        updateUserSocketId();
        setSocketReady(s => !s); // Toggle to trigger useEffect
    }, [updateUserSocketId]);

    // Create/connect socket when needed
    useEffect(() => {
        const socket = getSocketInstance();
        if (isLoggedIn && !socket?.connected) {
            createSocketInstance(
                { userId: userInfo.id, token: access_token },
                handleSocketConnected
            );
        } else if (!isLoggedIn) {
            dispatch(updatedSocketConnectionStatus(null));
            const socket = getSocketInstance();
            socket?.disconnect();
        }
        // eslint-disable-next-line
    }, [isLoggedIn, isSocketConnected, userInfo?.id, access_token, handleSocketConnected, dispatch]);

    // Attach listeners when socket is ready
    useEffect(() => {
        const socket = getSocketInstance();
        if (!socket) return;

        const handleRequestUpdate = (updatedRequest) => {
            console.log('Received UserRequestSocket event:', updatedRequest);
            if (!isEmpty(updatedRequest)) {
                const { status } = updatedRequest || {};
                if (status) {
                    if (status === RideStatus.ACCEPTED) {
                        playSound(audio.booking);
                    }
                    if (ClearRideStatus.includes(status)) {
                        console.log('emitting socket event for rideCompleted with request_id:', updatedRequest?.request_id, socket.id);

                        socket.emit(SOCKET_EVENTS.rideCompleted, {rideId: updatedRequest?.request_id});
                        dispatch(clearRideChats());
                    }
                }
                dispatch(updateDriversRequest(updatedRequest));
            }
        };

        const handleDriverLocationUpdate = (updatedLocation) => {
            console.log('Received DriverLocationSocket event:', updatedLocation);
            if (updatedLocation?.latitude) {
                dispatch(updateDriverLocation(updatedLocation));
            }
        };

        const handleDisconnect = () => {
            dispatch(updatedSocketConnectionStatus(null));
        };

        socket.on(USER_SOCKET_EVENTS.request_status, handleRequestUpdate);
        socket.on(USER_SOCKET_EVENTS.driver_location, handleDriverLocationUpdate);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off(USER_SOCKET_EVENTS.request_status, handleRequestUpdate);
            socket.off(USER_SOCKET_EVENTS.driver_location, handleDriverLocationUpdate);
            socket.off('disconnect', handleDisconnect);
        };
    }, [socketReady, dispatch, playSound]);

    // Attach chat listeners when needed
    useEffect(() => {
        const socket = getSocketInstance();
        if (activeRequestId && isSocketConnected && activeRequestInfo?.status === RideStatus.ACCEPTED) {
            const cleanup = onChat(socket, activeRequestId);
            return () => {
                cleanup?.();
            };
        }
        return undefined;
    }, [activeRequestId, isSocketConnected, activeRequestInfo?.status, onChat]);
}