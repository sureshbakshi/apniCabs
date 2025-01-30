import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import ContainerWrapper from './ContainerWrapper';
import CustomButton from './CustomButton';
import socket from './socket';
import { useDispatch, useSelector } from 'react-redux';
import { setRideChats } from '../../slices/authSlice';
import config from '../../util/config';
import { useNavigation } from "@react-navigation/native";

const ChatUI = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]); // Stores the list of messages
  const [inputText, setInputText] = useState(''); // Stores the current input text
  const { rideChats } = useSelector((state) => state.auth);
  console.log('rideChats', rideChats)


  const navigation = useNavigation();

  useEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
    };
  }, [navigation]);
  

  useEffect(() => {
    // Listen for incoming messages
    //Always flex-start
    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      dispatch(setRideChats({
        ride_id: '',
        messages: [{ message: msg, user: config.ROLE, align: 'flex-start' }]
      }))
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText };
      socket.emit("sendMessage", newMessage);
      //Always flex-end
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      dispatch(setRideChats(
        {
          ride_id: 1,
          message: { message: inputText, user: config.ROLE, align: 'flex-start' }
        }
      ))
      setInputText("");
    }
  };


  return (
    <ContainerWrapper>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {/* Message List */}
          <FlatList
            data={rideChats?.messages || []}
            keyExtractor={(item,key) => key.toString()}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, {
                alignSelf: item.align,
              }]}>
                <Text style={styles.messageText}>{item.message}</Text>
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
    backgroundColor: '#f5f5f5',
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