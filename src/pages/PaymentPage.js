import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { goBack } from '../util/navigationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { Icon } from '../components/common';
import { useVerifyPaymentMutation } from '../slices/apiSlice';

const PaymentPage = ({ navigation, route }) => {
  const { url, order_id, order_key } = route.params || {};
  const [transactionStatus, setTransactionStatus] = useState(null); // 'success' | 'failure' | null
  const [verifyPayment] = useVerifyPaymentMutation();
  const webviewRef = useRef(null);

  useEffect(() => {
    if (route.params?.txnId) {
      setTransactionStatus('success');
    } else if (!url) {
      goBack();
    }
  }, [route.params?.txnId, url]);

  const updateTransactionStatus = async (transactionInfo) => {
    try {
      await verifyPayment({ order_id, order_key, txnResponse: transactionInfo }).unwrap();
      setTransactionStatus('success');
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setTransactionStatus('failure');
    }
  }

  const handleWebViewMessage = (event) => {
    const { data } = event.nativeEvent;
    try {
      const parsedData = JSON.parse(data);
      if (parsedData?.type === 'payment_success' || parsedData?.type === 'payment_failure') {
        updateTransactionStatus(parsedData?.message);
      }
    } catch (error) {
      console.error('Failed to parse message from WebView', error);
    }
  };

  if (transactionStatus === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Icon name="check-circle" size={'doubleLarge'} color={COLORS.green} />
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.message}>Your transaction has been completed successfully.</Text>
          <TouchableOpacity style={styles.button} onPress={() => goBack()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (transactionStatus === 'failure') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Icon name="alert-circle" size={'doubleLarge'} color={COLORS.red} />
          <Text style={styles.title}>Payment Failed</Text>
          <Text style={styles.message}>Something went wrong with your transaction. Please try again.</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.red }]} onPress={() => goBack()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  const handleNavigationStateChange = (navState) => {
    // navState contains properties like:
    // url, title, loading, canGoBack, canGoForward
    const { url, loading } = navState;

    if (!loading) {
      console.log("Current URL:", url);
    }
  };

  if (url) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          source={{ uri: url }}
          domStorageEnabled={true}
          setSupportMultipleWindows={true} // Crucial for pop-ups
          javaScriptCanOpenWindowsAutomatically={true}
          mixedContentMode="always"
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          onNavigationStateChange={handleNavigationStateChange}

        />
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: COLORS.black,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.text_gray,
    marginBottom: 30,
  },
  button: {
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentPage;
