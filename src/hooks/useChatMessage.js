import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, SOCKET_EVENTS } from "../constants";
import { setRideChats } from "../slices/authSlice";

const otherUserStyle = {
    bg_style: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.bg_gray_primary,
    },
    text_style: {
        color: COLORS.text_dark1
    }
};

const myStyle = {
    bg_style: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.secondary_blue,
    },
    text_style: {
        color: COLORS.white
    }
}

const useChatMessage = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // Returns a stable function that attaches a single listener and returns a cleanup function
    const attachChatListener = React.useCallback((socket, rideId) => {
        if (!socket) return () => { };

        const handler = (data) => {
            // If a rideId is provided, ensure the incoming message belongs to the active ride
            if (rideId && data?.ride_id && String(data.ride_id) !== String(rideId)) return;
            const styles = (userInfo?.id === data.userId) ? myStyle : otherUserStyle;
            dispatch(setRideChats({
                ride_id: data?.ride_id || '',
                message: { message: data?.message, ...styles }
            }));
        };

        // Ensure we don't multiply listeners: remove existing listeners for this event first
        try {
            socket.off(SOCKET_EVENTS.newMessage);
        } catch (e) {
            // ignore if socket.off not available or throws
        }

        socket.on(SOCKET_EVENTS.newMessage, handler);

        // Return cleanup to remove this handler
        return () => {
            try {
                socket.off(SOCKET_EVENTS.newMessage, handler);
            } catch (e) {
                // ignore
            }
        };
    }, [userInfo?.id, dispatch]);

    return attachChatListener;
};

export default useChatMessage;


