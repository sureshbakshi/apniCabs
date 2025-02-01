import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import ContainerWrapper from './ContainerWrapper';
import CustomButton from './CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { setRideChats } from '../../slices/authSlice';
import config from '../../util/config';
import { COLORS, SOCKET_EVENTS } from '../../constants';
import socket from '../../sockets/socketConfig';
import { isDriver } from '../../util';

const ChatUI = () => {
  const [inputText, setInputText] = useState(''); // Stores the current input text
  const { rideChats } = useSelector((state) => state.auth);
  const { activeRideId } = useSelector((state) => isDriver() ? state.driver : state.user);
  const flatListRef = useRef();




  useEffect(() => {
    if (socket && activeRideId) {
      socket?.emit(SOCKET_EVENTS.joinRoom, activeRideId);  // Replace with the actual rideId
    }
  }, [activeRideId, socket])


  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText };
      if (newMessage) {
        socket.emit(SOCKET_EVENTS.sendMessage, newMessage);
      }
      setInputText("");
    }
  };

  // Scroll to the end whenever messages change
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [rideChats]);

  return (
    <ContainerWrapper>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {/* Message List */}
          <FlatList
            ref={flatListRef}
            data={rideChats?.messages || []}
            keyExtractor={(item, key) => key.toString()}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, {
                ...item.bg_style
              }]}>
                <Text style={[styles.messageText, { ...item.text_style }]}>{item.message}</Text>
              </View>
            )}
            contentContainerStyle={styles.messageList}
          />

          {/* Input and Send Button */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
            />
            <CustomButton label={'Send'} onPress={sendMessage} isLowerCase />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ContainerWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    padding: 10,
  },
  messageBubble: {
    backgroundColor: '#e1e1e1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});

export default ChatUI;