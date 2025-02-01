import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../constants";
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
    const {  userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const onChat = (socket) => {
        console.log('socket caling',socket)
        socket.on("new-message", (data) => {
            console.log('data',data)
            const styles = (userInfo.id === data.userId) ? myStyle : otherUserStyle
            dispatch(setRideChats({
                ride_id: '',
                message: { message: data.message?.text, ...styles }
            }))
        });
    }

  return onChat;
};

export default useChatMessage;


