import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, SOCKET_EVENTS } from "../constants";
import { setRideChatHistory, setRideChats } from "../slices/authSlice";

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

const getStyles = (loginUserId, senderId) => (loginUserId === senderId) ? myStyle : otherUserStyle;

const formatHistoryChat = (data) => {
    if (!data?.messages || !Array.isArray(data.messages)) return [];

    const formattedMessages = data.messages
        .map(msg => ({
            id: msg.id || msg.timestamp || Math.random().toString(36).substr(2, 9),
            message: msg.message,
            timestamp: msg.timestamp,
            userId: msg.userId || msg.senderId,
            ...getStyles(data.loginUserId || '', msg.userId || msg.senderId || '')
        }))
        .sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        });

    return formattedMessages;
};


const useChatMessage = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // Returns a stable function that attaches a single listener and returns a cleanup function
    const attachChatListener = React.useCallback((socket, rideId) => {
        if (!socket) return () => { };

        const handler = (data) => {
            // If a rideId is provided, ensure the incoming message belongs to the active ride
            if (!rideId || !userInfo?.id) return;

            dispatch(setRideChats({
                ride_id: rideId || '',
                message: { message: data?.message, ...getStyles(userInfo.id, data.userId) }
            }));
        };

        const historyHandler = (data) => {
            if (!rideId || !userInfo?.id) return;
            // Format the entire history array
            const formattedHistory = formatHistoryChat({
                ...data,
                loginUserId: userInfo.id,
                messages: data.messages
            });

            // Dispatch formatted history messages
            dispatch(setRideChatHistory({
                ride_id: rideId || '',
                messageHistory: formattedHistory
            }));
        };

        // Ensure we don't multiply listeners: remove existing listeners for this event first
        try {
            socket.off(SOCKET_EVENTS.newMessage);
            socket.off(SOCKET_EVENTS.messageHistory, historyHandler)
        } catch (e) {
            // ignore if socket.off not available or throws
        }

        socket.on(SOCKET_EVENTS.newMessage, handler);
        socket.on(SOCKET_EVENTS.messageHistory, historyHandler)

        // Return cleanup to remove this handler
        return () => {
            try {
                socket.off(SOCKET_EVENTS.newMessage, handler);
                socket.off(SOCKET_EVENTS.messageHistory, historyHandler)
            } catch (e) {
                // ignore
            }
        };
    }, [userInfo?.id, dispatch]);

    return attachChatListener;
};

export default useChatMessage;


