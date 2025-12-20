import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import ContainerWrapper from './ContainerWrapper';
import CustomButton from './CustomButton';
import { useSelector } from 'react-redux';
import { COLORS, SOCKET_EVENTS } from '../../constants';
import { getSocketInstance } from '../../sockets/socketConfig';
import { isDriver } from '../../util';
import { useTranslation } from 'react-i18next';

const ChatUI = () => {
  const { t } = useTranslation();
  const isDriverLogged = isDriver();
  const rideChats = useSelector((state) => state.auth.rideChats);
  const activeRequestId = useSelector((state) => isDriverLogged ? state.driver.activeRequestId : state.user.activeRequestId);
  const flatListRef = useRef(null);

  useEffect(() => {
    const socket = getSocketInstance();
    if (!socket || !socket.connected || !activeRequestId) return;
    socket.emit(SOCKET_EVENTS.joinRoom, activeRequestId);
  }, [activeRequestId]);

  // Move input state inside a memoized child to avoid re-renders of the whole Chat on typing
  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd?.({ animated: true });
  }, []);

  const MessageBubble = memo(({ item }) => (
    <View style={[styles.messageBubble, { ...item.bg_style }]}>
      <Text style={[styles.messageText, { ...item.text_style }]}>{item?.message}</Text>
    </View>
  ));

  const renderItem = useCallback(({ item }) => (
    <MessageBubble item={item} />
  ), []);

  const ChatInput = memo(({ placeholder, sendLabel }) => {
    const [text, setText] = useState('');

    const onSubmit = useCallback(() => {
      const message = text.trim();
      if (!message) return;
      const socket = getSocketInstance();
      if (socket && socket.connected) {
        socket.emit(SOCKET_EVENTS.sendMessage, message);
      }
      setText('');
    }, [text]);

    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          returnKeyType="send"
          onSubmitEditing={onSubmit}
        />
        <CustomButton label={sendLabel} onPress={onSubmit} isLowerCase />
      </View>
    );
  });

  return (
    <ContainerWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={rideChats?.messages || []}
          keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
          renderItem={renderItem}
          onContentSizeChange={scrollToBottom}
          contentContainerStyle={styles.messageList}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        />

        {/* Input and Send Button */}
        <ChatInput placeholder={t('chat_placeholder')} sendLabel={t('send_btn')} />
      </KeyboardAvoidingView>
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

export default memo(ChatUI);