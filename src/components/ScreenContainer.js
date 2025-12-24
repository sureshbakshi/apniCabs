import React from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenContainer = props => {
  const { children } = props;
  return (
    // <SafeAreaView style={{
    //   flex: 1, backgroundColor: '#fff',
    // }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="always"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
    // </SafeAreaView>
  );
};

export default ScreenContainer;