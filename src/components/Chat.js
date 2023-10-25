import {GiftedChat} from 'react-native-gifted-chat';
import React, {useState, useEffect, useCallback} from 'react';
import socket from './common/socket';
import images from '../util/images';
const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    socket.on('message', message => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, {
          _id: 1,
          text: message,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'nickname',
            avatar: `captain${1}`,
          },
        }),
      );
    });
    return () => {
      socket.off('message');
    };
  }, []);
  const onSend = useCallback(newMessages => {
    socket.emit('message', newMessages[0].text);
  }, []);
  return <GiftedChat messages={messages} onSend={onSend} user={{_id: 1}} />;
};
export default ChatScreen;
