import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import socket from './common/socket';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', messageInput);
    setMessageInput('');
  };

  return (
    <View>
      <Text>Socket.io Chat App</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <TextInput
        value={messageInput}
        onChangeText={(text) => setMessageInput(text)}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
