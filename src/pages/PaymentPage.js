import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { goBack, navigate } from '../util/navigationService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, ROUTES_NAMES } from '../constants';
import { Icon } from '../components/common';

const PaymentPage = ({ route }) => {
  const { url } = route.params || {};
  const [transactionStatus, setTransactionStatus] = useState(null); // 'success' | 'failure' | null
  const webviewRef = useRef(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer;
    if (transactionStatus === 'success' || transactionStatus === 'failure') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [transactionStatus]);

  useEffect(() => {
    if (countdown === 0) {
      navigate(ROUTES_NAMES.transactions);
    }
  }, [countdown]);

  useEffect(() => {
    if (route.params?.txnId && route.params?.status === "Success") {
      setTransactionStatus('success');
    } else if (!url) {
      setTransactionStatus('failure');
    }
  }, [route.params?.txnId, route.params?.status, url]);

  const handleWebViewMessage = (event) => {
    const { data } = event.nativeEvent;
    try {
      const parsedData = JSON.parse(data);
      if (parsedData?.message?.status === 111) {
        setTransactionStatus('failure');
      }
    } catch (error) {
      console.error('Failed to parse message from WebView', error);
      setTransactionStatus('failure');
    }
  };

  if (transactionStatus === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Icon name="check-circle" size={'doubleLarge'} color={COLORS.green} />
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.message}>Your transaction has been completed successfully.</Text>
          <Text style={styles.redirectMessage}>You will be redirected to subscription page in {countdown} seconds.</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigate(ROUTES_NAMES.transactions)}>
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
          <Text style={styles.redirectMessage}>You will be redirected to subscription page in {countdown} seconds.</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.red }]} onPress={() => navigate(ROUTES_NAMES.transactions)}>
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
  redirectMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.text_gray,
    marginBottom: 20,
    fontStyle: 'italic',
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
