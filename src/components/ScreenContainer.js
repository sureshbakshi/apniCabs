import { KeyboardAvoidingView, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';

const ScreenContainer = props => {
  const { children } = props;
  return (
    <SafeAreaView style={ { flex: 1 ,     backgroundColor: '#fff',
  } }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
        style={ { flex: 1 } }
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          { children }
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenContainer;