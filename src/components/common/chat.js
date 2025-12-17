import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import ContainerWrapper from './ContainerWrapper';
import CustomButton from './CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SOCKET_EVENTS } from '../../constants';
import { getSocketInstance } from '../../sockets/socketConfig';
import { getScreen, isDriver } from '../../util';
import { useTranslation } from 'react-i18next';
const socket = getSocketInstance()
const ChatUI = () => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState(''); // Stores the current input text
  const { rideChats } = useSelector((state) => state.auth);
  const isDriverLogged = isDriver();
  const { activeRequestId } = useSelector((state) => isDriverLogged ? state.driver : state.user);
  const flatListRef = useRef();

  useEffect(() => {
    console.log('activeRequestId', activeRequestId)
    if (socket && activeRequestId) {
      console.log('activeRequestId', activeRequestId)
      socket?.emit(SOCKET_EVENTS.joinRoom, activeRequestId);  // Replace with the actual rideId
    }
  }, [activeRequestId, socket])


  const sendMessage = () => {
    if (inputText.trim()) {
      if (inputText) {
        socket.emit(SOCKET_EVENTS.sendMessage, inputText);
      }
      setInputText("");
    }
  };

  // Scroll to the end whenever messages change
  useEffect(() => {
    if (flatListRef?.current && rideChats?.messages?.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [rideChats?.messages]);

  return (
    <SafeAreaView style={styles.container}>
      <ContainerWrapper>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {/* Message List */}
          <FlatList
            ref={flatListRef}
            data={rideChats?.messages || []}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, {
                ...item.bg_style
              }]}>
                <Text style={[styles.messageText, { ...item.text_style }]}>{item?.message}</Text>
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
              placeholder={t('chat_placeholder')}
            />
            <CustomButton label={t('send_btn')} onPress={sendMessage} isLowerCase />
          </View>
        </KeyboardAvoidingView>
      </ContainerWrapper>
    </SafeAreaView>
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